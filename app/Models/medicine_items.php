<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class medicine_items extends Model
{
    use HasFactory;

    public function medicine()
    {
        return $this->belongsTo(medicines::class, "medicine", "id");
    }
}
