<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('menu_items')->insert([
            [
                'store_id' => 1, // Rishon Deli
                'name' => 'Chicken Wrap',
                'price' => 1199, // $11.99
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'store_id' => 1,
                'name' => 'Falafel Plate',
                'price' => 899, // $8.99
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'store_id' => 2, // Direct Bites
                'name' => 'Pizza Slice',
                'price' => 499, // $4.99
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'store_id' => 2,
                'name' => 'Caesar Salad',
                'price' => 799, // $7.99
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'store_id' => 3, // Uber Fresh Market
                'name' => 'Smoothie',
                'price' => 599, // $5.99
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'store_id' => 3,
                'name' => 'Avocado Toast',
                'price' => 699, // $6.99
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
