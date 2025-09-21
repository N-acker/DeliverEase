<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id', 'pickup_address', 'dropoff_address', 'quote_id', 'delivery_id', 'total_price'
    ];
}
