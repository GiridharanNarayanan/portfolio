/**
 * ATS-Optimized Resume Generator - Teal Modern Style
 * Sans-serif font (Helvetica) with teal accent
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');

// Colors - Teal Modern
const DARK_TEXT = '#1f2937';
const MEDIUM_TEXT = '#4b5563';
const LIGHT_GRAY = '#9ca3af';
const ACCENT_COLOR = '#0d9488'; // Teal

// Page settings
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 40;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);

// Font settings - Sans-serif
const FONT_REGULAR = 'Helvetica';
const FONT_BOLD = 'Helvetica-Bold';
const FONT_ITALIC = 'Helvetica-Oblique';

function createResume() {
    const doc = new PDFDocument({
        size: 'letter',
        margins: { top: 36, bottom: 36, left: MARGIN, right: MARGIN }
    });

    const outputPath = 'Giridharan_Narayanan_Resume_TealModern.pdf';
    doc.pipe(fs.createWriteStream(outputPath));

    let y = 36;

    // === HEADER ===
    doc.font(FONT_BOLD)
        .fontSize(18)
        .fillColor(DARK_TEXT)
        .text('GIRIDHARAN NARAYANAN', MARGIN, y, { align: 'center', width: CONTENT_WIDTH });
    
    y += 24;
    doc.font(FONT_REGULAR)
        .fontSize(11)
        .fillColor(MEDIUM_TEXT)
        .text('Principal Software Engineer | Engineering Manager', MARGIN, y, { align: 'center', width: CONTENT_WIDTH });
    
    y += 18;
    
    // Contact line with clickable links
    const contactY = y;
    doc.fontSize(9).fillColor(MEDIUM_TEXT);
    
    const contactParts = [
        { text: 'New Jersey, USA', link: null },
        { text: ' | ', link: null },
        { text: '+1-425-572-2849', link: null },
        { text: ' | ', link: null },
        { text: 'Giridharan.n.2112@gmail.com', link: 'mailto:Giridharan.n.2112@gmail.com' },
    ];
    
    let totalWidth = 0;
    contactParts.forEach(part => {
        totalWidth += doc.widthOfString(part.text);
    });
    totalWidth += doc.widthOfString(' | LinkedIn | Portfolio');
    
    let xPos = (PAGE_WIDTH - totalWidth) / 2;
    
    contactParts.forEach(part => {
        if (part.link) {
            doc.fillColor(ACCENT_COLOR)
                .text(part.text, xPos, contactY, { link: part.link, continued: false, underline: true });
        } else {
            doc.fillColor(MEDIUM_TEXT)
                .text(part.text, xPos, contactY, { continued: false });
        }
        xPos += doc.widthOfString(part.text);
    });
    
    doc.fillColor(MEDIUM_TEXT).text(' | ', xPos, contactY, { continued: false });
    xPos += doc.widthOfString(' | ');
    doc.fillColor(ACCENT_COLOR)
        .text('LinkedIn', xPos, contactY, { link: 'https://www.linkedin.com/in/giridharan-narayanan/', underline: true, continued: false });
    xPos += doc.widthOfString('LinkedIn');
    
    doc.fillColor(MEDIUM_TEXT).text(' | ', xPos, contactY, { continued: false });
    xPos += doc.widthOfString(' | ');
    doc.fillColor(ACCENT_COLOR)
        .text('Portfolio', xPos, contactY, { link: 'https://girid.me', underline: true, continued: false });
    
    y += 16;
    
    // Divider line
    doc.strokeColor(LIGHT_GRAY)
        .lineWidth(1)
        .moveTo(MARGIN, y)
        .lineTo(PAGE_WIDTH - MARGIN, y)
        .stroke();
    
    y += 10;

    // === SUMMARY ===
    y = addSectionHeader(doc, 'SUMMARY', y);
    doc.font(FONT_REGULAR)
        .fontSize(9)
        .fillColor(DARK_TEXT);
    
    const summary = 'Principal-level software engineer and engineering manager with 13+ years at Microsoft, combining deep technical ownership with thoughtful people and product leadership. Experienced in building high-impact product systems, leading senior engineering teams, and delivering measurable business impact across enterprise products. Known for driving clarity, trust, and execution in fast-moving product environments.';
    
    y = addParagraph(doc, summary, y, MARGIN, CONTENT_WIDTH);
    y += 6;

    // === CORE SKILLS ===
    y = addSectionHeader(doc, 'CORE SKILLS', y);
    
    doc.font(FONT_BOLD).fontSize(9).fillColor(DARK_TEXT).text('Languages: ', MARGIN, y, { continued: true });
    doc.font(FONT_REGULAR).text('C#, Python, TypeScript');
    y = doc.y + 2;
    
    doc.font(FONT_BOLD).text('Frameworks: ', MARGIN, y, { continued: true });
    doc.font(FONT_REGULAR).text('.NET, React, Node.js');
    y = doc.y + 2;
    
    doc.font(FONT_BOLD).text('Cloud: ', MARGIN, y, { continued: true });
    doc.font(FONT_REGULAR).text('Azure, Docker');
    y = doc.y + 2;
    
    doc.font(FONT_BOLD).text('Data: ', MARGIN, y, { continued: true });
    doc.font(FONT_REGULAR).text('ClickHouse, REST APIs, ETL, Streaming');
    y = doc.y + 2;
    
    doc.font(FONT_BOLD).text('Architecture: ', MARGIN, y, { continued: true });
    doc.font(FONT_REGULAR).text('Microservices, Event-Driven Systems, API Design');
    y = doc.y + 2;
    
    doc.font(FONT_BOLD).text('Leadership: ', MARGIN, y, { continued: true });
    doc.font(FONT_REGULAR).text('Team Growth, Mentorship, Hiring, Performance Reviews');
    y = doc.y + 2;
    
    doc.font(FONT_BOLD).text('Product: ', MARGIN, y, { continued: true });
    doc.font(FONT_REGULAR).text('Cross-Functional Collaboration, Roadmap Execution');
    y = doc.y + 8;

    // === EXPERIENCE ===
    y = addSectionHeader(doc, 'EXPERIENCE', y);

    y = addJobEntry(doc, y, {
        title: 'Principal Software Engineering Manager',
        company: 'Microsoft — Copilot Analytics, Viva Insights | New Jersey, USA | Apr 2023 – Present',
        bullets: [
            'Lead Copilot Analytics organization driving adoption, ROI understanding, and business impact of Microsoft Copilot',
            'Built analytics feedback loops that helped customers understand, trust, and expand their Copilot usage',
            'Organizations using Copilot Analytics purchased ~140% more Copilot licenses and had ~280% more active Copilot users compared to non-analytics customers',
            'Scaled the team from 7 to 10 engineers while maintaining strong ownership culture and delivery quality',
            'Delivered Copilot Dashboard and enterprise metrics platform used by business and IT leaders',
            'Own technical direction, hiring, performance development, and roadmap execution'
        ]
    });

    y = addJobEntry(doc, y, {
        title: 'Principal Software Development Engineer',
        company: 'Microsoft — Viva Insights (Manager Effectiveness) | New Jersey, USA | Sept 2022 – Apr 2023',
        bullets: [
            'Tech Lead for manager effectiveness experiences delivering actionable, explainable insights for people managers',
            'Owned end-to-end delivery from problem framing through production rollout'
        ]
    });

    y = addJobEntry(doc, y, {
        title: 'Senior Software Development Engineer / Tech Lead',
        company: 'Microsoft — Viva Insights (Daily Briefing, Manager Experiences) | Redmond, USA | Sept 2019 – Sept 2022',
        bullets: [
            'Led engineering for Viva Daily Briefing email reaching ~40M monthly active users at peak',
            'Designed scalable backend services and data pipelines supporting millions of daily interactions',
            'Primary technical owner for multiple production-critical components'
        ]
    });

    y = addJobEntry(doc, y, {
        title: 'Senior Software Development Engineer',
        company: 'Microsoft India — Azure DevOps (ChatOps Integrations) | Hyderabad, India | Feb 2018 – Sept 2019',
        bullets: [
            'Delivered Microsoft Teams and Slack integrations for Azure DevOps services',
            'Owned strategy definition, execution planning, and cross-team delivery coordination'
        ]
    });

    y = addJobEntry(doc, y, {
        title: 'Software Development Engineer',
        company: 'Microsoft India — Azure DevOps (Agile, VC, Wiki) | Hyderabad, India | 2013 – 2018',
        bullets: [
            'Designed and led Azure DevOps Wiki architecture including storage, REST APIs, and UX integration',
            'Delivered Git, project creation, and collaboration experiences used by millions of developers'
        ]
    });

    // === LEADERSHIP & RECOGNITION ===
    y = addSectionHeader(doc, 'LEADERSHIP & RECOGNITION', y);
    y = addBullet(doc, 'Microsoft High Potential (HiPo) Leadership Program participant', y);
    y = addBullet(doc, 'Azure DevOps Emerging Leaders initiative', y);
    y = addBullet(doc, 'Mentor supporting career growth across multiple engineering teams', y);
    y += 4;

    // === EDUCATION ===
    y = addSectionHeader(doc, 'EDUCATION', y);
    doc.font(FONT_BOLD).fontSize(9).fillColor(DARK_TEXT)
        .text('B.Tech in Information Technology', MARGIN, y, { continued: true });
    doc.font(FONT_REGULAR).text(', PSG College of Technology — 2013');
    y = doc.y + 2;
    doc.font(FONT_REGULAR).fontSize(9).fillColor(DARK_TEXT)
        .text('CGPA: 9.8', MARGIN, y);

    doc.end();
    console.log(`✅ Resume generated: ${outputPath}`);
}

function addSectionHeader(doc, text, y) {
    doc.font(FONT_BOLD)
        .fontSize(11)
        .fillColor(ACCENT_COLOR)
        .text(text, MARGIN, y);
    return doc.y + 4;
}

function addParagraph(doc, text, y, x, width) {
    doc.font(FONT_REGULAR)
        .fontSize(9)
        .fillColor(DARK_TEXT)
        .text(text, x, y, { width: width, lineGap: 1 });
    return doc.y;
}

function addJobEntry(doc, y, job) {
    doc.font(FONT_BOLD)
        .fontSize(10)
        .fillColor(DARK_TEXT)
        .text(job.title, MARGIN, y);
    y = doc.y + 1;
    
    doc.font(FONT_ITALIC)
        .fontSize(9)
        .fillColor(MEDIUM_TEXT)
        .text(job.company, MARGIN, y);
    y = doc.y + 2;
    
    for (const bullet of job.bullets) {
        y = addBullet(doc, bullet, y);
    }
    
    return y + 4;
}

function addBullet(doc, text, y) {
    doc.font(FONT_REGULAR)
        .fontSize(9)
        .fillColor(DARK_TEXT)
        .text('•  ' + text, MARGIN + 8, y, { width: CONTENT_WIDTH - 16, lineGap: 0.5 });
    return doc.y + 2;
}

createResume();
