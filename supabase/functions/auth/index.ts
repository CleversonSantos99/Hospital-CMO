import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

interface SignUpRequest {
  email: string;
  password: string;
}

interface SignInRequest {
  email: string;
  password: string;
}

interface SignOutRequest {
  refresh_token: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase configuration");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function signUp(payload: SignUpRequest) {
  const { email, password } = payload;

  if (!email || !password) {
    return {
      status: 400,
      body: { error: "Email and password are required" },
    };
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    return {
      status: 400,
      body: { error: error.message },
    };
  }

  return {
    status: 201,
    body: { user: data.user },
  };
}

async function signIn(payload: SignInRequest) {
  const { email, password } = payload;

  if (!email || !password) {
    return {
      status: 400,
      body: { error: "Email and password are required" },
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      status: 401,
      body: { error: error.message },
    };
  }

  return {
    status: 200,
    body: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user,
    },
  };
}

async function signOut(payload: SignOutRequest) {
  const { refresh_token } = payload;

  if (!refresh_token) {
    return {
      status: 400,
      body: { error: "Refresh token is required" },
    };
  }

  const { error } = await supabase.auth.admin.signOut(refresh_token);

  if (error) {
    return {
      status: 400,
      body: { error: error.message },
    };
  }

  return {
    status: 200,
    body: { message: "Signed out successfully" },
  };
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const url = new URL(req.url);
    const pathname = url.pathname.replace(/^\/functions\/[^/]+/, "");

    if (pathname === "/signup" && req.method === "POST") {
      const payload = await req.json();
      const result = await signUp(payload);
      return new Response(JSON.stringify(result.body), {
        status: result.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (pathname === "/signin" && req.method === "POST") {
      const payload = await req.json();
      const result = await signIn(payload);
      return new Response(JSON.stringify(result.body), {
        status: result.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (pathname === "/signout" && req.method === "POST") {
      const payload = await req.json();
      const result = await signOut(payload);
      return new Response(JSON.stringify(result.body), {
        status: result.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Auth function error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
