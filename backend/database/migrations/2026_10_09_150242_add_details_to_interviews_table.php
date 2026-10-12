
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->nullable();
            $table->string('telephone')->nullable();
            $table->string('source')->nullable();
            $table->string('cv')->nullable();
            $table->string('fonction')->nullable();
            $table->string('duree_stage')->nullable();

            $table->foreignId('created_by_rh_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('candidates', function (Blueprint $table) {
            $table->dropForeign(['created_by_rh_id']);

            $table->dropColumn([
                'nom',
                'prenom',
                'email',
                'telephone',
                'source',
                'cv',
                'fonction',
                'duree_stage',
                'created_by_rh_id',
            ]);
        });
    }
};