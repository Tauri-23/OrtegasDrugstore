<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class medicines extends Model
{
    use HasFactory;

    public function group()
    {
        return $this->belongsTo(medicine_groups::class, "group", "id");
    }
}
