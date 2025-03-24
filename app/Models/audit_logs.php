<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class audit_logs extends Model
{
    public function admin() 
    {
        return $this->belongsTo(user_admins::class, 'admin', 'id');
    }

    public function cashier() 
    {
        return $this->belongsTo(user_cashiers::class, 'cashier', 'id');
    }

    public function discount() 
    {
        return $this->belongsTo(discounts::class, 'discount', 'id');
    }

    public function transaction()
    {
        return $this->belongsTo(purchase_transactions::class, 'transaction', 'id');
    }
}
