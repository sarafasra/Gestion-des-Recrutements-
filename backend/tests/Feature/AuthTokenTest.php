<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
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
            ->getJson('/api/candidates')
            ->assertOk();

        $this->withToken($token)
            ->getJson('/api/interviews')
            ->assertOk();

        $this->withToken($token)
            ->postJson('/api/logout')
            ->assertOk();

        $this->withToken($token)
            ->getJson('/api/user')
            ->assertUnauthorized();
    }
}
