<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Candidate;
use App\Models\Interview;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class AuthTokenTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_token_authorizes_candidates_and_can_be_revoked(): void
    {
        $user = User::factory()->create();

        $this->getJson('/api/candidates')->assertUnauthorized();
        $this->getJson('/api/interviews')->assertUnauthorized();

        $login = $this->postJson('/api/login', [
            'email' => $user->email,
            'password' => 'password',
        ])->assertOk()->assertJsonStructure([
            'token',
            'user' => ['id', 'role'],
        ]);

        $token = $login->json('token');

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertOk()
            ->assertJsonPath('id', $user->id);

        $this->withToken($token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('id', $user->id);

        $this->withToken($token)
            ->getJson('/api/candidates')
            ->assertOk();

        $this->withToken($token)
            ->getJson('/api/interviews')
            ->assertOk();

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertOk();

        $this->assertDatabaseCount('personal_access_tokens', 0);

        Auth::forgetGuards();

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertUnauthorized();
    }

    public function test_admin_can_fetch_supervision_counts(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $token = $admin->createToken('auth_token')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/candidates')
            ->assertOk();

        $this->withToken($token)
            ->getJson('/api/interviews')
            ->assertOk();

        $this->withToken($token)
            ->getJson('/api/rh/dashboard-stats')
            ->assertOk();

        $this->withToken($token)
            ->getJson('/api/admin/supervision')
            ->assertOk()
            ->assertJsonPath('stats.total_users', 1)
            ->assertJsonPath('stats.total_rh', 0)
            ->assertJsonPath('stats.total_candidates', 0)
            ->assertJsonPath('stats.total_interviews', 0)
            ->assertJsonPath('candidates', []);
    }

    public function test_admin_can_manage_rh_candidates_and_interviews(): void
    {
        $rh = User::factory()->create(['role' => 'rh']);
        $admin = User::factory()->create(['role' => 'admin']);
        $candidate = Candidate::create([
            'nom' => 'Doe',
            'prenom' => 'Jane',
            'created_by_rh_id' => $rh->id,
        ]);
        $interview = Interview::create([
            'candidate_id' => $candidate->id,
            'type' => 'presentiel',
            'statut' => 'planifiee',
        ]);
        $token = $admin->createToken('auth_token')->plainTextToken;

        $this->withToken($token)
            ->getJson('/api/candidates/'.$candidate->id)
            ->assertOk();

        $this->withToken($token)
            ->putJson('/api/candidates/'.$candidate->id, ['nom' => 'Updated'])
            ->assertOk()
            ->assertJsonPath('nom', 'Updated');

        $this->withToken($token)
            ->getJson('/api/interviews/'.$interview->id)
            ->assertOk();

        $this->withToken($token)
            ->putJson('/api/interviews/'.$interview->id, ['statut' => 'accepte'])
            ->assertOk()
            ->assertJsonPath('statut', 'accepte');

        $createdInterview = $this->withToken($token)
            ->postJson('/api/interviews', [
                'candidate_id' => $candidate->id,
                'responsable_id' => $rh->id,
                'type' => 'en_ligne',
                'lieu_lien' => 'https://example.test/interview',
                'date_heure' => now()->addDay()->toDateTimeString(),
                'statut' => 'planifiee',
            ])
            ->assertCreated();

        $this->withToken($token)
            ->deleteJson('/api/interviews/'.$createdInterview->json('id'))
            ->assertOk();

        $this->withToken($token)
            ->deleteJson('/api/interviews/'.$interview->id)
            ->assertOk();

        $this->withToken($token)
            ->deleteJson('/api/candidates/'.$candidate->id)
            ->assertOk();
    }

    public function test_public_registration_is_disabled(): void
    {
        $this->postJson('/api/register', [
            'name' => 'New User',
            'email' => 'new@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ])->assertNotFound();
    }
}
