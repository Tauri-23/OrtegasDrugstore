<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class purchase_transactions extends Model
{
    use HasFactory;

    public function items()
    {
        return $this->hasMany(purchase_transaction_items::class, 'purchase_transaction', 'id')->with('medicine');
    }

    public function discounts()
    {
        return $this->hasMany(purchase_transaction_discounts::class, 'purchase_transaction', 'id')->with('discount');
    }
    
    public function customer()
    {
        return $this->belongsTo(purchase_transaction_customer::class, 'customer', 'id');
    }
}
