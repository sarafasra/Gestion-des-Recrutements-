<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Illuminate\Http\Request;

class CandidateController extends Controller
{


public function index(Request $request)
{
    $query = Candidate::where('created_by_rh_id', $request->user()->id);

    if ($request->priorite) {
        $query->where('priorite', $request->priorite);
    }

    if ($request->nom) {
        $query->where('nom', 'like', '%' . $request->nom . '%');
    }

    if ($request->fonction) {
        $query->where('fonction', 'like', '%' . $request->fonction . '%');
    }

    return $query->get();
}

    

public function store(Request $request)
{
    $data = $request->validate([
        'nom' => 'required|string',
        'prenom' => 'required|string',
        'email' => 'nullable|email',
        'telephone' => 'nullable|string',
        'source' => 'nullable|string',
        'fonction' => 'nullable|string',
        'duree_stage' => 'nullable|string',
        'priorite' => 'sometimes|in:haute,moyenne,basse',
        'cv' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
    ]);

    if ($request->hasFile('cv')) {
        $data['cv'] = $request->file('cv')->store('cvs', 'public');
    }

    $data['priorite'] = $data['priorite'] ?? 'moyenne';
    $data['created_by_rh_id'] = $request->user()->id;

    return Candidate::create($data);
}

    public function show(Request $request, string $id)
    {
        return Candidate::where(
            'created_by_rh_id',
            $request->user()->id
        )->findOrFail($id);
    }

   
public function update(Request $request, string $id)
{
    $candidate = Candidate::where(
        'created_by_rh_id',
        $request->user()->id
    )->findOrFail($id);

    $data = $request->validate([
        'nom' => 'sometimes|required|string',
        'prenom' => 'sometimes|required|string',
        'email' => 'sometimes|nullable|email',
        'telephone' => 'sometimes|nullable|string',
        'source' => 'sometimes|nullable|string',
        'fonction' => 'sometimes|nullable|string',
        'duree_stage' => 'sometimes|nullable|string',
        'priorite' => 'sometimes|in:haute,moyenne,basse',
        'cv' => 'sometimes|nullable|file|mimes:pdf,doc,docx|max:2048',
    ]);

    if ($request->hasFile('cv')) {
        $data['cv'] = $request->file('cv')->store('cvs', 'public');
    }

    $candidate->update($data);

    return response()->json($candidate);
}

    public function destroy(Request $request, string $id)
    {
        $candidate = Candidate::where(
            'created_by_rh_id',
            $request->user()->id
        )->findOrFail($id);

        $candidate->delete();

        return response()->json([
            'message' => 'Candidat supprimé avec succès'
        ]);
    }
}