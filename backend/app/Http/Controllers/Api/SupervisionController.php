<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use App\Models\Interview;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

class SupervisionController extends Controller
{
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_rh' => User::where('role', 'rh')->count(),
            ...$this->recruitmentStats(),
        ];

        $candidates = Candidate::with('interviews')
            ->latest()
            ->get();

        return response()->json([
            'stats' => $stats,
            'candidates' => $candidates
        ]);
    }

    public function rhDashboard(Request $request)
    {
        if ($request->user()->role !== 'rh') {
            return response()->json([
                'message' => 'Accès refusé. Réservé aux responsables RH.',
            ], 403);
        }

        $candidateScope = fn (Builder $query) => $query->where(
            'created_by_rh_id',
            $request->user()->id
        );

        $recentInterviews = Interview::with('candidate:id,nom,prenom')
            ->whereHas('candidate', $candidateScope)
            ->latest('date_heure')
            ->limit(3)
            ->get(['id', 'candidate_id', 'date_heure', 'statut']);

        return response()->json([
            'stats' => $this->recruitmentStats($candidateScope),
            'recent_interviews' => $recentInterviews,
        ]);
    }

    private function recruitmentStats(?callable $candidateScope = null): array
    {
        $candidates = Candidate::query();

        if ($candidateScope) {
            $candidateScope($candidates);
        }

        $interviews = Interview::query();

        if ($candidateScope) {
            $interviews->whereHas('candidate', $candidateScope);
        }

        $acceptedCandidates = clone $candidates;
        $acceptedCandidates->whereHas('interviews', fn (Builder $query) => $query
            ->where('statut', 'accepte'));

        $upcomingInterviews = clone $interviews;
        $upcomingInterviews->where('date_heure', '>=', now());

        $pendingInterviews = clone $interviews;
        $pendingInterviews->where('statut', 'en_attente');

        return [
            'total_candidates' => $candidates->count(),
            'total_interviews' => $interviews->count(),
            'upcoming_interviews' => $upcomingInterviews->count(),
            'accepted_candidates' => $acceptedCandidates->count(),
            'pending_interviews' => $pendingInterviews->count(),
        ];
    }
}