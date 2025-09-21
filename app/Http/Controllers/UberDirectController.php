<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request; //ask GPT in consultant 
use App\Services\UberDirectService;

class UberDirectController extends Controller
{
    protected $uberService; //ask GPT why not private

    public function __construct(UberDirectService $uberService) // you can see here how were using the service
    {
        $this->uberService = $uberService; // like this.uberService = uberservice(parameter passed)
        //remember => is not the same as ->
    }

    public function getQuote(Request $request)
    {
        
        $dropoffAddress = $request->input('dropoff_address');
        $pickupAddress = $request->input('pickup_address');
        $pickupLat = $request->input('pickup_latitude');
        $pickupLng = $request->input('pickup_longitude');
        $dropOffLat = $request->input('dropoff_latitude');
        $dropOffLng = $request->input('dropoff_longitude');
        $pickupPhoneNumber = $request->input('pickup_phone_number');
        $dropoffPhoneNumber = $request->input('dropoff_phone_number');
        $manifestTotalValue = $request->input('manifest_total_value');
        $externalStoreId = $request->input('external_store_id');

            // Pass it to UberService
        $quote = app(UberDirectService::class)->getQuote([
        'pickup_address' => $pickupAddress,
        'dropoff_address' => $dropoffAddress,
        'pickup_latitude' => $pickupLat,
        'pickup_longitude' => $pickupLng,
        'dropoff_latitude' => $dropOffLat,
        'dropoff_longitude' => $dropOffLng,
        'pickup_phone_number' => $pickupPhoneNumber,
        'dropoff_phone_number' => $dropoffPhoneNumber,
        'manifest_total_value' => $manifestTotalValue,
        'external_store_id' => $externalStoreId,
        ]);

        return response()->json($quote);

    }

    public function bookDelivery(Request $request) //getting the quoteId by calling the createDelivery method in UberDirectService
    {
      
    }

    // public function testUber()
    // {

    //      // Keep your original pickup/dropoff info
    //     $pickupAddress = "123 King St W, Toronto, ON M5H 3T9";
    //     $dropoffAddress = "456 Bloor St W, Toronto, ON M5S 1X8";

    //     $quoteResponse = $this->uberService->getQuote($pickupAddress, $dropoffAddress);

    //     $quoteId = $quoteResponse['id'] ?? null;

    //     if ($quoteId) {
    //         $deliveryResponse = $this->uberService->createDelivery($quoteId, [
    //         'pickup_address' => $pickupAddress,
    //         'dropoff_address' => $dropoffAddress,
    //     ]);
    //         return response()->json([
    //             'quote' => $quoteResponse,
    //             'delivery' => $deliveryResponse,
    //         ]);
    //     } else {
    //         return response()->json([
    //             'error' => 'Quote failed',
    //             'response' => $quoteResponse,
    //         ]);
    //     }
    // }

}
