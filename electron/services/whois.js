// electron/services/whois.js
import whois from "whois-json";

export async function lookupWHOIS(ip) {
  try {
    // Skip private/local IPs
    if (!ip || /^10\.|^192\.168\.|^127\./.test(ip)) {
      return null;
    }

    const data = await whois(ip, { timeout: 4000 });

    return {
      org: data.org || data.Organization || null,
      country: data.country || data.Country || null,
      asn: data.asn || data.ASN || null,
      registrar: data.registrar || null,
    };
  } catch (err) {
    console.error("WHOIS lookup failed for", ip, err.message);
    return null;
  }
}
