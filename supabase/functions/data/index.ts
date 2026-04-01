import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { jwtDecode } from "npm:jwt-decode@4.0.0";

interface DecodedJWT {
  sub: string;
  iat: number;
  exp: number;
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

function verifyJWT(token: string): DecodedJWT | null {
  try {
    const decoded = jwtDecode<DecodedJWT>(token);
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < now) {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

function getAuthToken(req: Request): string | null {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
}

async function getEspecialidades() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("especialidade")
    .select("*");

  if (error) {
    return { status: 400, body: { error: error.message } };
  }

  return { status: 200, body: { data } };
}

async function getProcedimentos() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("procedimentos")
    .select("*");

  if (error) {
    return { status: 400, body: { error: error.message } };
  }

  return { status: 200, body: { data } };
}

async function getLeads() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("leads")
    .select("*");

  if (error) {
    return { status: 400, body: { error: error.message } };
  }

  return { status: 200, body: { data } };
}

async function getAgendamentos() {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("agendamentos")
    .select("*");

  if (error) {
    return { status: 400, body: { error: error.message } };
  }

  return { status: 200, body: { data } };
}

async function updateEspecialidade(id: number, payload: unknown) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("especialidade")
    .update(payload)
    .eq("id", id)
    .select();

  if (error) {
    return { status: 400, body: { error: error.message } };
  }

  return { status: 200, body: { data } };
}

async function updateProcedimento(id: number, payload: unknown) {
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("procedimentos")
    .update(payload)
    .eq("id", id)
    .select();

  if (error) {
    return { status: 400, body: { error: error.message } };
  }

  return { status: 200, body: { data } };
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const token = getAuthToken(req);
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing or invalid authorization" }), {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const decoded = verifyJWT(token);
    if (!decoded) {
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 401,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    const url = new URL(req.url);
    const pathname = url.pathname.replace(/^\/functions\/[^/]+\/data/, "");

    if (pathname === "/especialidades" && req.method === "GET") {
      const result = await getEspecialidades();
      return new Response(JSON.stringify(result.body), {
        status: result.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (pathname === "/procedimentos" && req.method === "GET") {
      const result = await getProcedimentos();
      return new Response(JSON.stringify(result.body), {
        status: result.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (pathname === "/leads" && req.method === "GET") {
      const result = await getLeads();
      return new Response(JSON.stringify(result.body), {
        status: result.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (pathname === "/agendamentos" && req.method === "GET") {
      const result = await getAgendamentos();
      return new Response(JSON.stringify(result.body), {
        status: result.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (pathname.startsWith("/especialidades/") && req.method === "PUT") {
      const id = parseInt(pathname.split("/")[2]);
      const payload = await req.json();
      const result = await updateEspecialidade(id, payload);
      return new Response(JSON.stringify(result.body), {
        status: result.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    if (pathname.startsWith("/procedimentos/") && req.method === "PUT") {
      const id = parseInt(pathname.split("/")[2]);
      const payload = await req.json();
      const result = await updateProcedimento(id, payload);
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
    console.error("Data function error:", error);
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
