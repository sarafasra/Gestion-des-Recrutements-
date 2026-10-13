
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Candidate extends Model
{
    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'telephone',
        'source',
        'cv',
        'fonction',
        'duree_stage',
        'created_by_rh_id',
    ];

    public function createdByRh(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_rh_id');
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class, 'candidate_id');
    }
}