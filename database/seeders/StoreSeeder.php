<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('stores')->insert([
            [
                'address' => '123 King St W, Toronto, ON M5H 3T9',
                'phone' => '+14165551234',
                'external_store_id' => 'demo-store-001',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'address' => '789 Queen St E, Toronto, ON M4M 1H5',
                'phone' => '+14168889999',
                'external_store_id' => 'demo-store-002',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'address' => '55 Glen Cameron Rd, Thornhill, ON L3T 1P2',
                'phone' => '+14167776666',
                'external_store_id' => 'demo-store-003',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
