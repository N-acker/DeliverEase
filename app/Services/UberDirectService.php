<?php

namespace App\Services;

use Illuminate\Support\Facades\Http; //ask GPT consultant 
use Illuminate\Support\Facades\Log;

class UberDirectService
{
    protected $baseUrl;
    protected $clientId;
    protected $clientSecret;
    protected $customerId;
    protected $externalStoreId = 'demo-store-001'; // dummy store ID; in reality this will be added to database for user to select
    protected $token;

    public function __construct() //this service object will be used by the controller
    {
        $this->baseUrl = config('services.uber.base_url'); // you're getting this from the config file which gets it from .env
        $this->clientId = config('services.uber.client_id');
        $this->clientSecret = config('services.uber.client_secret');
        $this->customerId = config('services.uber.customer_id');
    }


    private function getAccessToken()
    {
        if ($this->token) 
        {
            return $this->token;
        } // Reuse token if already fetched

        $response = Http::asForm()->post('https://login.uber.com/oauth/v2/token', [
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'grant_type' => 'client_credentials',
            'scope' => 'eats.deliveries',
        ]);

        $token = $response->json('access_token');
        // Log::info('Token response:', $response->json());

        return $this->token = $token; // Save token for reuse
    }


    public function getQuote(array $data) //pickup and dropoff address extracted from API and returned as JSON
    {
        $token = $this->getAccessToken();

        $pickupReady = now()-> addMinutes(10)->toIso8601String(); // gets the time "now", adds 10 minutes and converts to string 
        $pickupDeadline = now()-> addMinutes(45)->toIso8601String();
        $dropoffReady = now()-> addMinutes(20)->toIso8601String();
        $dropoffDeadline = now()-> addMinutes(60)->toIso8601String();

        $payload = [
            "pickup_address" => $data['pickup_address'],
            "dropoff_address" => $data['dropoff_address'],
            "pickup_latitude" => $data['pickup_latitude'],
            "pickup_longitude" => $data['pickup_longitude'],
            "dropoff_latitude" => $data['dropoff_latitude'],
            "dropoff_longitude" => $data['dropoff_longitude'],
            "pickup_ready_dt" => $pickupReady,
            "pickup_deadline_dt" => $pickupDeadline,
            "dropoff_ready_dt" => $dropoffReady,
            "dropoff_deadline_dt" => $dropoffDeadline,
            "pickup_phone_number" => $data['pickup_phone_number'],
            "dropoff_phone_number" => $data['dropoff_phone_number'],
            "manifest_total_value" => $data['manifest_total_value'],
            "external_store_id" => $data['external_store_id'] 
        ];

        //pickupaddress, pickup phone#, 

        $response = Http::withToken($token)
        ->post("{$this->baseUrl}/v1/customers/{$this->customerId}/delivery_quotes", $payload);
        
        return $response->json();
    }


    public function createDelivery(array $data) //quote_id is extracted from API and returned as JSON
    {
        $token = $this->getAccessToken();

        $payload = [
           "quote_id" => $data['quote_id'],
            "pickup_address" =>  $data['pickup_address'],
            "pickup_latitude" => $data['pickup_latitude'],
            "pickup_longitude" => $data['pickup_longitude'],
            "pickup_name" => $data['pickup_name'],
            "pickup_phone_number" => $data['pickup_phone_number'],

            "dropoff_address" => $data['dropoff_address'],
            "dropoff_latitude" => $data['dropoff_latitude'],
            "dropoff_longitude" => $data['dropoff_longitude'],
            "dropoff_name" => $data['dropoff_name'], 
            "dropoff_phone_number" => $data['dropoff_phone_number'],

            "manifest_items" => $data['manifest_items'],
            "manifest_total_value" => $data['manifest_total_value'], //is the value of all the items not including the uber direct fee and taxes unless included in the price
            "external_store_id" => $data['external_store_id'],
        ];

        
        $response =  Http::withToken($token)
        ->post("{$this->baseUrl}/v1/customers/{$this->customerId}/deliveries", $payload);

        Log::info('Create delivery response', [
        'status' => $response->status(),
        'json'   => $response->json(),
        'body'   => $response->body(),
        ]);

        if ($response->failed()) {
            return ['error' => 'create_delivery_failed', 'status' => $response->status(), 'body' => $response->json() ?? $response->body()];
        }

        return $response->json();
    }
    
}