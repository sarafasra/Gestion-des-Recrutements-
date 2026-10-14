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
    $query = Interview::with('candidate');

    if ($request->filled('statut')) {
        $query->where('statut', $request->statut);
    }

    if ($request->filled('responsable_id')) {
        $query->where('responsable_id', $request->responsable_id);
    }

    return response()->json($query->latest()->get());
}


    public function store(Request $request)
    {
$data = $request->validate([
    'candidate_id' => 'required|exists:candidates,id',
'responsable_id' => 'required|exists:users,id,role,rh',
    'type' => 'required|in:en_ligne,presentiel',
    'lieu_lien' => 'required|string',
    'date_heure' => 'required|date',
    'statut' => 'nullable|in:planifiee,en_attente,accepte,refuse,annule',
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
    'candidate_id' => 'sometimes|required|exists:candidates,id',
'responsable_id' => 'sometimes|required|exists:users,id,role,rh',
    'type' => 'sometimes|required|in:en_ligne,presentiel',
    'lieu_lien' => 'sometimes|required|string',
    'date_heure' => 'sometimes|required|date',
    'statut' => 'sometimes|required|in:planifiee,en_attente,accepte,refuse,annule',
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