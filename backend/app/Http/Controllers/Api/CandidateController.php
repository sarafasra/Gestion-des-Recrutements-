<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    public function index(Request $request)
    {
        return Candidate::where(
            'created_by_rh_id',
            $request->user()->id
        )->get();
    }

    
public function store(Request $request)
{
    $request->validate([
        'nom' => 'required',
        'prenom' => 'required',
        'cv' => 'nullable|file|mimes:pdf,doc,docx|max:2048',
    ]);

    $data = $request->only([
        'nom',
        'prenom',
        'email',
        'telephone',
        'source',
        'fonction',
        'duree_stage',
    ]);

    if ($request->hasFile('cv')) {
        $data['cv'] = $request->file('cv')->store('cvs', 'public');
    }

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

        $candidate->update($request->all());

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