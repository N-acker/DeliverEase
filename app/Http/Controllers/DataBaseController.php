<?php

namespace App\Http\Controllers;
use App\Models\Store;
use App\Models\MenuItem;
use App\Models\Order;
use Illuminate\Http\Request;

class DataBaseController extends Controller
{
    
    public function accessOrders()
    {
        return Order::all();
    }

    public function getAllStores()
    {
        return Store::all();
    }

    public function getAllMenuItems()
    {
        return MenuItem::all();
    }

}
