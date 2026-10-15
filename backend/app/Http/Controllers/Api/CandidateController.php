<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CandidateController extends Controller
{
   
public function index(Request $request)
{
    $query = Candidate::query();

    if ($request->user()->role === 'rh') {
        $query->where('created_by_rh_id', $request->user()->id);
    }

    if ($request->filled('priorite')) {
        $query->where('priorite', $request->priorite);
    }

    if ($request->filled('nom')) {
        $query->where('nom', 'like', '%' . $request->nom . '%');
    }

    if ($request->filled('fonction')) {
        $query->where('fonction', 'like', '%' . $request->fonction . '%');
    }

    if ($request->filled('statut')) {
        $query->whereHas('interviews', function ($interviewQuery) use ($request) {
            $interviewQuery->where('statut', $request->statut);
        });
    }

    return response()->json($query->latest()->get());
}


      

    public function store(Request $request)
    {
       
      
        $data = $request->validate([
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email',
            'telephone' => 'required|string',
            'source' => 'required|string',
            'fonction' => 'required|string',
            'duree_stage' => 'required|string',
            'priorite' => 'required|in:haute,moyenne,basse',
'cv' => 'nullable|file|extensions:pdf,doc,docx|max:2048',
        ]);

        if ($request->hasFile('cv')) {
            $data['cv'] = $request->file('cv')->store('cvs', 'local');
        }

        $data['created_by_rh_id'] = $request->user()->id;

        $candidate = Candidate::create($data);

        return response()->json($candidate, 201);
    }

    public function show(Request $request, string $id)
    {
        $query = Candidate::query();

        if ($request->user()->role === 'rh') {
            $query->where('created_by_rh_id', $request->user()->id);
        }

        $candidate = $query->findOrFail($id);

        return response()->json($candidate);
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
            'email' => 'sometimes|required|email',
            'telephone' => 'sometimes|required|string',
            'source' => 'sometimes|required|string',
            'fonction' => 'sometimes|required|string',
            'duree_stage' => 'sometimes|required|string',
            'priorite' => 'sometimes|required|in:haute,moyenne,basse',
            'cv' => 'sometimes|nullable|file|mimes:pdf,doc,docx|max:2048',
        ]);

        $oldCv = $candidate->cv;
        $newCv = null;

        if ($request->hasFile('cv')) {
            $newCv = $request->file('cv')->store('cvs', 'local');

            if (!$newCv) {
                return response()->json([
                    'message' => 'Échec du stockage du CV.',
                ], 500);
            }

            $data['cv'] = $newCv;
        }

        $candidate->update($data);

        if (
            $newCv &&
            $oldCv &&
            $oldCv !== $newCv &&
            Storage::disk('local')->exists($oldCv)
        ) {
            Storage::disk('local')->delete($oldCv);
        }

        return response()->json($candidate->fresh());
    }

    public function destroy(Request $request, string $id)
    {
        $candidate = Candidate::where(
            'created_by_rh_id',
            $request->user()->id
        )->findOrFail($id);

        $cvPath = $candidate->cv;

        $candidate->delete();

        if ($cvPath && Storage::disk('local')->exists($cvPath)) {
            Storage::disk('local')->delete($cvPath);
        }

        return response()->json([
            'message' => 'Candidat supprimé avec succès',
        ]);
    }


public function showCv(Request $request, string $id)
{
    $query = Candidate::query();

    if ($request->user()->role === 'rh') {
        $query->where('created_by_rh_id', $request->user()->id);
    }

    $candidate = $query->findOrFail($id);

    if (!$candidate->cv || !Storage::disk('local')->exists($candidate->cv)) {
        abort(404, 'CV introuvable');
    }

    return Storage::disk('local')->download($candidate->cv);
}


}
