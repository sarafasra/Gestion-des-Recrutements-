
< ?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    public function index()
    {
        return Candidate::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required',
            'prenom' => 'required',
            'email' => 'nullable|email',
            'telephone' => 'nullable',
            'source' => 'nullable',
            'cv' => 'nullable',
            'fonction' => 'nullable',
            'duree_stage' => 'nullable',
        ]);

        $candidate = Candidate::create($request->all());

        return response()->json($candidate, 201);
    }

    public function show(string $id)
    {
        return Candidate::findOrFail($id);
    }

    public function update(Request $request, string $id)
    {
        $candidate = Candidate::findOrFail($id);

        $candidate->update($request->all());

        return response()->json($candidate);
    }

    public function destroy(string $id)
    {
        $candidate = Candidate::findOrFail($id);

        $candidate->delete();

        return response()->json([
            'message' => 'Candidat supprimé avec succès'
        ]);
    }
}