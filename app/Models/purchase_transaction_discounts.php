<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class purchase_transaction_discounts extends Model
{
    use HasFactory;

    public function discount()
    {
        return $this->belongsTo(discounts::class, 'discount', 'id');
    }
}
