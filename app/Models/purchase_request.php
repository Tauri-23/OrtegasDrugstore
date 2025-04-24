<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class purchase_request extends Model
{
    //

    public function requested_by()
    {
        return $this->belongsTo(user_admins::class, "requested_by", "id");
    }

    public function medicine()
    {
        return $this->belongsTo(medicines::class, "medicine", "id");
    }
}
