<?php

namespace App\Providers;

use App\Contracts\IGenerateIdService;
use App\Services\GenerateIdService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->bind(IGenerateIdService::class, GenerateIdService::class);
    }
}