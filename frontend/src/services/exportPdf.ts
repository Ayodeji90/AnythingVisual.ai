import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SceneData {
  scene_number: number;
  slug: string;
  title?: string;
  int_ext: string;
  day_night: string;
  location: string;
  description: string;
  objective?: string;
  emotional_tone?: string;
  visual_energy?: string;
  characters?: string;
  script_text?: string;
  shooting_style?: string;
  shot_types?: string;
  lighting?: string;
  props?: string;
  environment_elements?: string;
}

interface BlueprintData {
  id: number;
  logline?: string;
  synopsis?: string;
  genre?: string;
  detected_characters?: string;
  scenes: SceneData[];
}

function parseJsonField(val: string | null | undefined): string[] {
  if (!val) return [];
  try { return JSON.parse(val); } catch { return []; }
}

export function exportBlueprintPdf(
  projectTitle: string,
  blueprint: BlueprintData
) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // --- Title Page ---
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('ANYTHINGVISUAL.AI — PRODUCTION BLUEPRINT', margin, y);
  y += 14;

  doc.setFontSize(24);
  doc.setTextColor(30);
  doc.text(projectTitle.toUpperCase(), margin, y, { maxWidth: contentWidth });
  y += 12;

  if (blueprint.genre) {
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Genre: ${blueprint.genre}`, margin, y);
    y += 8;
  }

  if (blueprint.logline) {
    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text('LOGLINE', margin, y);
    y += 5;
    doc.setFontSize(10);
    doc.setTextColor(40);
    const loglineLines = doc.splitTextToSize(blueprint.logline, contentWidth);
    doc.text(loglineLines, margin, y);
    y += loglineLines.length * 5 + 6;
  }

  if (blueprint.synopsis) {
    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text('SYNOPSIS', margin, y);
    y += 5;
    doc.setFontSize(9);
    doc.setTextColor(40);
    const synLines = doc.splitTextToSize(blueprint.synopsis, contentWidth);
    doc.text(synLines, margin, y);
    y += synLines.length * 4.5 + 6;
  }

  const chars = parseJsonField(blueprint.detected_characters);
  if (chars.length > 0) {
    doc.setFontSize(11);
    doc.setTextColor(60);
    doc.text('CHARACTERS', margin, y);
    y += 5;
    doc.setFontSize(9);
    doc.setTextColor(40);
    doc.text(chars.join(', '), margin, y, { maxWidth: contentWidth });
    y += 8;
  }

  // --- Scene Breakdown Table ---
  doc.setFontSize(11);
  doc.setTextColor(60);
  y += 4;
  doc.text(`SCENE BREAKDOWN — ${blueprint.scenes.length} SCENES`, margin, y);
  y += 4;

  const tableBody = blueprint.scenes.map((s) => [
    String(s.scene_number),
    s.title || s.slug || '',
    `${s.int_ext} ${s.location}`,
    s.day_night || '',
    s.emotional_tone || '',
    s.visual_energy || '',
    (s.objective || s.description || '').substring(0, 120),
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['#', 'Title', 'Location', 'Time', 'Tone', 'Energy', 'Objective']],
    body: tableBody,
    styles: { fontSize: 7.5, cellPadding: 2 },
    headStyles: { fillColor: [35, 35, 30], textColor: [220, 200, 160], fontSize: 7 },
    columnStyles: {
      0: { cellWidth: 8 },
      1: { cellWidth: 28 },
      2: { cellWidth: 32 },
      3: { cellWidth: 16 },
      4: { cellWidth: 18 },
      5: { cellWidth: 16 },
      6: { cellWidth: 'auto' },
    },
    theme: 'grid',
  });

  // @ts-ignore - autoTable adds finalY
  y = (doc as any).lastAutoTable.finalY + 8;

  // --- Detailed Scene Pages ---
  for (const scene of blueprint.scenes) {
    doc.addPage();
    y = margin;

    // Scene header
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`${projectTitle} — Scene ${scene.scene_number}`, margin, y);
    y += 8;

    doc.setFontSize(16);
    doc.setTextColor(30);
    const sceneTitle = scene.title || scene.slug || `Scene ${scene.scene_number}`;
    doc.text(sceneTitle.toUpperCase(), margin, y, { maxWidth: contentWidth });
    y += 9;

    // Metadata row
    doc.setFontSize(9);
    doc.setTextColor(80);
    const metaLine = [
      `${scene.int_ext} ${scene.location}`,
      scene.day_night,
      scene.emotional_tone ? `Tone: ${scene.emotional_tone}` : '',
      scene.visual_energy ? `Energy: ${scene.visual_energy}` : '',
    ].filter(Boolean).join('  |  ');
    doc.text(metaLine, margin, y, { maxWidth: contentWidth });
    y += 8;

    // Characters
    const sceneChars = parseJsonField(scene.characters);
    if (sceneChars.length > 0) {
      doc.setFontSize(9);
      doc.setTextColor(60);
      doc.text('CHARACTERS', margin, y);
      y += 4;
      doc.setFontSize(8);
      doc.setTextColor(40);
      doc.text(sceneChars.join(', '), margin, y, { maxWidth: contentWidth });
      y += 7;
    }

    // Objective
    if (scene.objective) {
      doc.setFontSize(9);
      doc.setTextColor(60);
      doc.text('OBJECTIVE', margin, y);
      y += 4;
      doc.setFontSize(8);
      doc.setTextColor(40);
      const objLines = doc.splitTextToSize(scene.objective, contentWidth);
      doc.text(objLines, margin, y);
      y += objLines.length * 4 + 6;
    }

    // Script Text
    if (scene.script_text) {
      doc.setFontSize(9);
      doc.setTextColor(60);
      doc.text('SCRIPT', margin, y);
      y += 4;
      doc.setFontSize(8);
      doc.setTextColor(40);
      const scriptLines = doc.splitTextToSize(scene.script_text, contentWidth);
      // Handle page overflow
      for (const line of scriptLines) {
        if (y > 275) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 4;
      }
      y += 4;
    }

    // Enrichment data
    if (scene.shooting_style || scene.lighting) {
      doc.setFontSize(9);
      doc.setTextColor(60);
      doc.text('VISUAL INTELLIGENCE', margin, y);
      y += 5;
      doc.setFontSize(8);
      doc.setTextColor(40);

      if (scene.shooting_style) {
        doc.text(`Style: ${scene.shooting_style}`, margin, y);
        y += 4;
      }
      if (scene.lighting) {
        doc.text(`Lighting: ${scene.lighting}`, margin, y);
        y += 4;
      }

      const shotTypes = parseJsonField(scene.shot_types);
      if (shotTypes.length > 0) {
        doc.text(`Shots: ${shotTypes.join(', ')}`, margin, y, { maxWidth: contentWidth });
        y += 4;
      }

      const sceneProps = parseJsonField(scene.props);
      if (sceneProps.length > 0) {
        doc.text(`Props: ${sceneProps.join(', ')}`, margin, y, { maxWidth: contentWidth });
        y += 4;
      }

      const envElements = parseJsonField(scene.environment_elements);
      if (envElements.length > 0) {
        doc.text(`Environment: ${envElements.join(', ')}`, margin, y, { maxWidth: contentWidth });
        y += 4;
      }
    }
  }

  // --- Footer on every page ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(170);
    doc.text(
      `AnythingVisual.ai — ${projectTitle} — Page ${i} of ${totalPages}`,
      margin,
      doc.internal.pageSize.getHeight() - 8
    );
  }

  doc.save(`${projectTitle.replace(/\s+/g, '_')}_Blueprint.pdf`);
}
