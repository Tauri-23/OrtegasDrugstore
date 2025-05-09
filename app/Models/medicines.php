<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class medicines extends Model
{
    use HasFactory;

    public function group()
    {
        return $this->belongsTo(medicine_groups::class, "group", "id");
    }

    public function medicine_items()
    {
        return $this->hasMany(medicine_items::class, "medicine", "id")->orderBy("expiration_date", "asc")
        ->whereDate('expiration_date', '>', Carbon::now()->addMonth())
        ->orderBy('expiration_date', 'asc');
    }
}
