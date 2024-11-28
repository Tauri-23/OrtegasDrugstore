<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class medicine_groups extends Model
{
    use HasFactory;

    public function medicines()
    {
        return $this->hasMany(medicines::class, "group", "id");
    }
}
