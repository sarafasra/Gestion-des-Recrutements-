<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use App\Models\Candidate;
use Illuminate\Http\Request;

class InterviewController extends Controller
{
    public function index(Request $request)
    {
        return Interview::with('candidate')
            ->whereHas('candidate', function ($query) use ($request) {
                $query->where('created_by_rh_id', $request->user()->id);
            })
            ->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'candidate_id' => 'required|exists:candidates,id',
            'responsable_id' => 'nullable|exists:users,id',
            'type' => 'required|string',
            'lieu_lien' => 'nullable|string',
            'date_heure' => 'nullable|date',
            'statut' => 'nullable|string',
            'resultat' => 'nullable|string',
        ]);

        Candidate::where('created_by_rh_id', $request->user()->id)
            ->findOrFail($data['candidate_id']);

        $interview = Interview::create($data);

        return response()->json($interview, 201);
    }

    public function show(Request $request, string $id)
    {
        return Interview::with('candidate')
            ->whereHas('candidate', function ($query) use ($request) {
                $query->where('created_by_rh_id', $request->user()->id);
            })
            ->findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $interview = Interview::whereHas('candidate', function ($query) use ($request) {
            $query->where('created_by_rh_id', $request->user()->id);
        })->findOrFail($id);

        $data = $request->validate([
            'candidate_id' => 'sometimes|exists:candidates,id',
            'responsable_id' => 'nullable|exists:users,id',
            'type' => 'sometimes|string',
            'lieu_lien' => 'nullable|string',
            'date_heure' => 'nullable|date',
            'statut' => 'nullable|string',
            'resultat' => 'nullable|string',
        ]);

        if (isset($data['candidate_id'])) {
            Candidate::where('created_by_rh_id', $request->user()->id)
                ->findOrFail($data['candidate_id']);
        }

        $interview->update($data);

        return response()->json($interview);
    }

    public function destroy(Request $request, string $id)
    {
        $interview = Interview::whereHas('candidate', function ($query) use ($request) {
            $query->where('created_by_rh_id', $request->user()->id);
        })->findOrFail($id);

        $interview->delete();

        return response()->json([
            'message' => 'Entretien supprimé avec succès'
        ]);
    }
}