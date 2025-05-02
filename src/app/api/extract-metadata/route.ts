import * as jsdom from "jsdom";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL manquante" }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MetadataFetcher/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`Échec de récupération de la page: ${response.status}`);
    }

    const html = await response.text();
    const dom = new jsdom.JSDOM(html);
    const document = dom.window.document;

    const metadata = {
      url: url,
      title: getMetadata(document, "og:title") || document.title || "",
      description:
        getMetadata(document, "og:description") ||
        getMetadata(document, "description") ||
        "",
      image: getMetadata(document, "og:image") || "",
      site_name: getMetadata(document, "og:site_name") || "",
    };

    return NextResponse.json(metadata);
  } catch (error: any) {
    console.error("Erreur d'extraction de métadonnées:", error);

    return NextResponse.json(
      { error: error.message || "Échec d'extraction des métadonnées" },
      { status: 500 }
    );
  }
}

function getMetadata(document: Document, name: string): string | null {
  const ogTag = document.querySelector(`meta[property="${name}"]`);
  if (ogTag) {
    return ogTag.getAttribute("content");
  }
  const metaTag = document.querySelector(
    `meta[name="${name.replace("og:", "")}"]`
  );
  if (metaTag) {
    return metaTag.getAttribute("content");
  }
  return null;
}
