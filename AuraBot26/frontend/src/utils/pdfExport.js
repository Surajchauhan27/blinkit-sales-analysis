import jsPDF from 'jspdf';

export const exportChatAsPDF = (chat) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentW = pageW - margin * 2;
  let y = 20;

  // Header
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, pageW, 30, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('AuraBot AI Conversation', margin, 20);

  y = 40;
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 180);
  doc.setFont('helvetica', 'normal');
  doc.text(`Chat: ${chat.title}`, margin, y);
  doc.text(`Exported: ${new Date().toLocaleString()}`, margin, y + 5);
  doc.text(`Total Messages: ${chat.messages.length}`, margin, y + 10);
  y += 20;

  // Divider
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Messages
  for (const msg of chat.messages) {
    const isUser = msg.role === 'user';
    const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const label = isUser ? 'You' : 'AuraBot';

    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    // Label
    doc.setFontSize(8);
    doc.setTextColor(isUser ? 99 : 139, isUser ? 102 : 92, isUser ? 241 : 246);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label} · ${time}`, margin, y);
    y += 5;

    // Content
    doc.setTextColor(60, 60, 80);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    const lines = doc.splitTextToSize(msg.content.replace(/```[\s\S]*?```/g, '[code block]'), contentW);
    for (const line of lines) {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 4.5;
    }
    y += 4;
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 180);
    doc.text(`Page ${i} of ${pageCount} · AuraBot AI`, margin, 290);
  }

  doc.save(`${chat.title.replace(/[^a-z0-9]/gi, '_')}_AuraBot.pdf`);
};
