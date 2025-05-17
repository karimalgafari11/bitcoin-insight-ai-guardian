
import { corsHeaders } from './cors.ts';

// Helper for consistent error responses
export function errorResponse(message: string, status: number = 500): Response {
  console.error(`Error: ${message}`);
  return new Response(
    JSON.stringify({
      error: message,
      source: "error",
      isLive: false
    }),
    { 
      headers: { ...corsHeaders, "Content-Type": "application/json" }, 
      status 
    }
  );
}

// Helper for successful responses
export function successResponse(data: any): Response {
  return new Response(
    JSON.stringify(data),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Parse URL parameters with validation
export function parseRequestParams(url: URL): { 
  symbol: string, 
  currency: string, 
  source: string 
} {
  const symbol = url.searchParams.get('symbol') || 'BTC';
  const currency = url.searchParams.get('currency') || 'USD';
  const source = url.searchParams.get('source') || 'binance';
  
  return {
    symbol: symbol.toUpperCase(),
    currency: currency.toUpperCase(),
    source: source.toLowerCase()
  };
}
