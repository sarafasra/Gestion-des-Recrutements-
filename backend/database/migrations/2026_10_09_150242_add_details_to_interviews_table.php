
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('interviews', function (Blueprint $table) {
            $table->foreignId('candidate_id')
                ->constrained('candidates')
                ->cascadeOnDelete();

            $table->foreignId('responsable_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('type');
            $table->string('lieu_lien')->nullable();
            $table->dateTime('date_heure')->nullable();
            $table->string('statut')->default('planifiee');
            $table->text('resultat')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('interviews', function (Blueprint $table) {
            $table->dropForeign(['candidate_id']);
            $table->dropForeign(['responsable_id']);

            $table->dropColumn([
                'candidate_id',
                'responsable_id',
                'type',
                'lieu_lien',
                'date_heure',
                'statut',
                'resultat',
            ]);
        });
    }
};