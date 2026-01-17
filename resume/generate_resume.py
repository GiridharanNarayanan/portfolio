"""
ATS-Optimized Resume Generator
Generates a clean, single-page PDF resume using ReportLab
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# Colors
DARK_GRAY = HexColor("#333333")
MEDIUM_GRAY = HexColor("#555555")
LIGHT_GRAY = HexColor("#888888")
ACCENT_BLUE = HexColor("#2563eb")

def create_styles():
    """Create custom paragraph styles for the resume."""
    styles = getSampleStyleSheet()
    
    # Name - Large and prominent
    styles.add(ParagraphStyle(
        name='Name',
        fontName='Helvetica-Bold',
        fontSize=18,
        textColor=DARK_GRAY,
        alignment=TA_CENTER,
        spaceAfter=2,
    ))
    
    # Title/Role
    styles.add(ParagraphStyle(
        name='Title',
        fontName='Helvetica',
        fontSize=11,
        textColor=MEDIUM_GRAY,
        alignment=TA_CENTER,
        spaceAfter=4,
    ))
    
    # Contact Info
    styles.add(ParagraphStyle(
        name='Contact',
        fontName='Helvetica',
        fontSize=9,
        textColor=MEDIUM_GRAY,
        alignment=TA_CENTER,
        spaceAfter=8,
    ))
    
    # Section Headers
    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontName='Helvetica-Bold',
        fontSize=11,
        textColor=ACCENT_BLUE,
        spaceBefore=8,
        spaceAfter=4,
    ))
    
    # Job Title
    styles.add(ParagraphStyle(
        name='JobTitle',
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=DARK_GRAY,
        spaceBefore=6,
        spaceAfter=1,
    ))
    
    # Job Details (Company, Location, Date)
    styles.add(ParagraphStyle(
        name='JobDetails',
        fontName='Helvetica-Oblique',
        fontSize=9,
        textColor=MEDIUM_GRAY,
        spaceAfter=2,
    ))
    
    # Bullet Points
    styles.add(ParagraphStyle(
        name='Bullet',
        fontName='Helvetica',
        fontSize=9,
        textColor=DARK_GRAY,
        leftIndent=12,
        spaceAfter=2,
        leading=11,
    ))
    
    # Skills text
    styles.add(ParagraphStyle(
        name='Skills',
        fontName='Helvetica',
        fontSize=9,
        textColor=DARK_GRAY,
        spaceAfter=2,
        leading=12,
    ))
    
    # Summary
    styles.add(ParagraphStyle(
        name='Summary',
        fontName='Helvetica',
        fontSize=9,
        textColor=DARK_GRAY,
        spaceAfter=4,
        leading=12,
    ))
    
    return styles

def build_resume():
    """Build the resume document."""
    
    # Page setup - narrow margins for more content
    doc = SimpleDocTemplate(
        "Giridharan_Narayanan_Resume.pdf",
        pagesize=letter,
        leftMargin=0.5*inch,
        rightMargin=0.5*inch,
        topMargin=0.4*inch,
        bottomMargin=0.4*inch
    )
    
    styles = create_styles()
    story = []
    
    # === HEADER ===
    story.append(Paragraph("GIRIDHARAN NARAYANAN", styles['Name']))
    story.append(Paragraph("Principal Software Engineer | Engineering Manager", styles['Title']))
    story.append(Paragraph(
        "New Jersey, USA • +1-425-572-2849 • Giridharan.n.2112@gmail.com • linkedin.com/in/giridharan-narayanan • girid.me",
        styles['Contact']
    ))
    
    # Divider
    story.append(HRFlowable(width="100%", thickness=1, color=LIGHT_GRAY, spaceAfter=6))
    
    # === SUMMARY ===
    story.append(Paragraph("SUMMARY", styles['SectionHeader']))
    story.append(Paragraph(
        "Principal-level software engineer and engineering manager with 13+ years at Microsoft, combining deep technical ownership with people and product leadership. Experienced in building high-impact product systems, leading senior engineering teams, and delivering measurable business outcomes. Known for driving clarity, trust, and execution in fast-moving product environments.",
        styles['Summary']
    ))
    
    # === SKILLS ===
    story.append(Paragraph("SKILLS", styles['SectionHeader']))
    story.append(Paragraph(
        "<b>Technical:</b> C#, Python, TypeScript, .NET, React, Node.js, Azure, Docker, ClickHouse, Microservices, Event-Driven Architecture, REST APIs, ETL",
        styles['Skills']
    ))
    story.append(Paragraph(
        "<b>Leadership:</b> Team Building, Hiring, Mentorship, Performance Management, Cross-Functional Collaboration, Roadmap Execution",
        styles['Skills']
    ))
    
    # === EXPERIENCE ===
    story.append(Paragraph("EXPERIENCE", styles['SectionHeader']))
    
    # Job 1 - Current Role
    story.append(Paragraph("Principal Software Engineering Manager", styles['JobTitle']))
    story.append(Paragraph("Microsoft — Copilot Analytics, Viva Insights | New Jersey, USA | Apr 2023 – Present", styles['JobDetails']))
    story.append(Paragraph("• Lead Copilot Analytics organization driving adoption, ROI understanding, and business impact of Microsoft Copilot", styles['Bullet']))
    story.append(Paragraph("• Customers using Copilot Analytics purchased <b>140% more licenses</b> and had <b>286% more active users</b> vs non-analytics customers", styles['Bullet']))
    story.append(Paragraph("• Scaled team from 7 to 10 senior engineers while maintaining strong ownership culture and delivery quality", styles['Bullet']))
    story.append(Paragraph("• Delivered Copilot Dashboard and enterprise metrics platform used by business and IT leaders globally", styles['Bullet']))
    
    # Job 2
    story.append(Paragraph("Principal Software Development Engineer", styles['JobTitle']))
    story.append(Paragraph("Microsoft — Viva Insights (Manager Effectiveness) | New Jersey, USA | Sept 2022 – Apr 2023", styles['JobDetails']))
    story.append(Paragraph("• Tech Lead for manager effectiveness experiences delivering actionable, explainable insights for people managers", styles['Bullet']))
    story.append(Paragraph("• Owned end-to-end delivery from problem framing through production rollout", styles['Bullet']))
    
    # Job 3
    story.append(Paragraph("Senior Software Development Engineer / Tech Lead", styles['JobTitle']))
    story.append(Paragraph("Microsoft — Viva Insights (Daily Briefing) | Redmond, USA | Sept 2019 – Sept 2022", styles['JobDetails']))
    story.append(Paragraph("• Led engineering for Viva Daily Briefing email reaching <b>~40M monthly active users</b> at peak", styles['Bullet']))
    story.append(Paragraph("• Designed scalable backend services and data pipelines supporting millions of daily interactions", styles['Bullet']))
    
    # Job 4
    story.append(Paragraph("Senior Software Development Engineer", styles['JobTitle']))
    story.append(Paragraph("Microsoft India — Azure DevOps (ChatOps) | Hyderabad, India | Feb 2018 – Sept 2019", styles['JobDetails']))
    story.append(Paragraph("• Delivered Microsoft Teams and Slack integrations for Azure DevOps; owned strategy and cross-team coordination", styles['Bullet']))
    
    # Job 5
    story.append(Paragraph("Software Development Engineer", styles['JobTitle']))
    story.append(Paragraph("Microsoft India — Azure DevOps (Agile, Wiki, Git) | Hyderabad, India | 2012 – 2018", styles['JobDetails']))
    story.append(Paragraph("• Designed and led Azure DevOps Wiki architecture including storage, REST APIs, and UX integration", styles['Bullet']))
    story.append(Paragraph("• Delivered Git, project creation, and collaboration experiences used by millions of developers worldwide", styles['Bullet']))
    
    # === LEADERSHIP & RECOGNITION ===
    story.append(Paragraph("LEADERSHIP & RECOGNITION", styles['SectionHeader']))
    story.append(Paragraph("• Microsoft High Potential (HiPo) Leadership Program participant", styles['Bullet']))
    story.append(Paragraph("• Azure DevOps Emerging Leaders initiative member", styles['Bullet']))
    story.append(Paragraph("• Active mentor supporting career growth across multiple engineering teams", styles['Bullet']))
    
    # === EDUCATION ===
    story.append(Paragraph("EDUCATION", styles['SectionHeader']))
    story.append(Paragraph("B.Tech in Information Technology — PSG College of Technology, 2013 | CGPA: 9.8/10", styles['Skills']))
    
    # Build PDF
    doc.build(story)
    print("✅ Resume generated: Giridharan_Narayanan_Resume.pdf")

if __name__ == "__main__":
    build_resume()
