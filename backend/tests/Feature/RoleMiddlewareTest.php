<?php

namespace Tests\Feature;

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\RhMiddleware;
use Illuminate\Http\Request;
use Tests\TestCase;

class RoleMiddlewareTest extends TestCase
{
    public function test_rh_routes_allow_rh_and_admin(): void
    {
        $middleware = new RhMiddleware();

        $this->assertSame(204, $this->runMiddleware($middleware, 'rh'));
        $this->assertSame(204, $this->runMiddleware($middleware, 'admin'));
    }

    public function test_admin_routes_allow_admin_and_deny_rh(): void
    {
        $middleware = new AdminMiddleware();

        $this->assertSame(204, $this->runMiddleware($middleware, 'admin'));
        $this->assertSame(403, $this->runMiddleware($middleware, 'rh'));
    }

    private function runMiddleware(object $middleware, string $role): int
    {
        $request = Request::create('/api/role-check');
        $request->setUserResolver(fn () => (object) ['role' => $role]);

        return $middleware->handle(
            $request,
            fn () => response()->noContent()
        )->getStatusCode();
    }
}
