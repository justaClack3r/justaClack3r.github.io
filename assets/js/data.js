/* =========================================================================
   PORTFOLIO DATA — the single source of truth for the site.

   - Homepage cards, the timeline, filters, project title blocks and the
     "Revision history" (updates) tables are all generated from this file.
   - Long-form write-ups live in /projects/<slug>.html.

   To ADD A PROJECT: see README.md ("Adding a project").
   To POST AN UPDATE: add { date: "YYYY-MM-DD", text: "..." } to that
   project's `updates` array. It appears on the project page and in the
   homepage "Latest revisions" table automatically.

   All paths are relative to the site root (no leading slash).
   ========================================================================= */

window.PORTFOLIO = {
  person: {
    name: "Justice Hickman-Maynard",
    first: "Justice",
    last: "Hickman-Maynard",
    initials: "JHM",
    tagline: "Mechanical design · Robotics",
    // Contact info shown in the Contact section. Leave "" to hide an entry.
    email: "jhickmanmaynard@college.harvard.edu",
    linkedin: "https://www.linkedin.com/in/justice-hickman-maynard-356322323",
    github: "",
    resume: "" // e.g. "assets/docs/resume.pdf"
  },

  // Order here = order on the homepage.
  categories: [
    { id: "rover", title: "Mars Rover Program", blurb: "Two generations of the Harvard Undergraduate Robotics Club's University Rover Challenge rover: arms, grippers, suspension and chassis." },
    { id: "manip", title: "Arms, Grippers & Actuators", blurb: "Manipulation hardware for research and industry, from a re-engineered production arm down to the actuator inside each joint." },
    { id: "mech", title: "Mechanisms & Controls", blurb: "Original mechanisms, the math that makes them controllable, and the tools I built to design them." },
    { id: "research", title: "Research & Test Hardware", blurb: "Hardware built for labs and test campaigns: wildlife tags, a fabrication gantry, a rocket engine test stand and precision optics." },
    { id: "competition", title: "Competition Robotics", blurb: "Where it all started: FIRST Robotics Competition (FRC), FIRST Tech Challenge (FTC) and course competition robots, including a robot that placed second in the world in 2023." },
    { id: "fab", title: "Fabrication & Surfacing", blurb: "Machining practice and freeform surface modeling." }
  ],

  // Skill filters shown above the project grid. Project `skills` use these keys.
  skills: [
    { id: "mechanisms", label: "Mechanisms" },
    { id: "arms", label: "Arms & grippers" },
    { id: "fea", label: "Simulation / FEA" },
    { id: "controls", label: "Controls & kinematics" },
    { id: "embedded", label: "Embedded" },
    { id: "fab", label: "Fabrication" },
    { id: "test", label: "Test & measurement" }
  ],

  /* Project fields
     slug      file name of projects/<slug>.html and folder name in assets/img/
     dwg       permanent "drawing number" shown on cards and title blocks
     scale     "flagship" (wide card) | "major" | "standard" | "compact"
     own       "solo" | "lead" | "co" | "team"  (controls the role marker)
     role      what I personally designed/did
     team      context (lab, team, course) — "" if none
     sort      YYYY-MM used for the timeline
     cover     card image (use the -sm.webp version)
     video     true if the page includes video (shows a badge on the card)
     status    "Complete" | "In development" | "Ongoing"
  */
  projects: [
    {
      slug: "rover-2526", dwg: "01", category: "rover", scale: "flagship", featured: true,
      title: "Harvard Mars Rover, 2025–26",
      summary: "A second-generation rover built around a 6-DoF carbon-fiber arm with ~7 kg payload, two new grippers and a 90 kg-rated rocker suspension.",
      season: "Fall 2025 – Spring 2026", sort: "2026-05",
      own: "lead", role: "Lead mechanical designer: arm, grippers, suspension",
      team: "Harvard Undergraduate Robotics Club · University Rover Challenge",
      tools: "SolidWorks · CNC mill & lathe · Waterjet · 3D printing (Markforged Mark Two, Stratasys)",
      status: "Complete",
      cover: "assets/img/rover-2526/rover-yellow-sm.webp",
      featureMedia: "assets/video/arm6-teleop.mp4", featurePoster: "assets/video/arm6-teleop-poster.jpg",
      video: true,
      tags: ["6-DoF arm", "Differential wrist", "Belt-driven elbow", "Rocker suspension"],
      skills: ["arms", "mechanisms", "fab", "fea"],
      updates: [
        { date: "2026-09-01", text: "Full rover photographed with the 6-DoF arm, gripper and rocker suspension integrated." },
        { date: "2026-02-27", text: "Arm driven under teleoperation on the rover; arm model running in RViz motion planning." },
        { date: "2025-12-17", text: "Arm structure assembled; base strain-wave joint bench-tested." },
        { date: "2025-11-12", text: "First drive test of the new rocker suspension." }
      ]
    },
    {
      slug: "rover-2425", dwg: "02", category: "rover", scale: "flagship",
      title: "Harvard Mars Rover, 2024–25",
      summary: "The revived robotics club's first competition rover: my first robotic arm (5-DoF, 1.2 m), two grippers, a TIG-welded chassis and a six-wheel rocker-bogie.",
      season: "Fall 2024 – Summer 2025", sort: "2025-06",
      own: "lead", role: "Mechanical systems designer: arm, grippers, chassis, rocker-bogie",
      team: "Harvard Undergraduate Robotics Club · University Rover Challenge",
      tools: "SolidWorks · SolidWorks Simulation · Waterjet · TIG welding · 3D printing (Markforged Mark Two, Stratasys)",
      status: "Complete",
      cover: "assets/img/rover-2425/rover-yellow-sm.webp",
      video: true,
      tags: ["5-DoF arm", "Strain wave", "Welded chassis", "Rocker-bogie"],
      skills: ["arms", "mechanisms", "fea", "fab"],
      updates: []
    },
    {
      slug: "integrated-actuator", dwg: "03", category: "manip", scale: "major", featured: true,
      title: "Integrated Robot Actuator",
      summary: "A compact, high-torque joint module: frameless BLDC, strain-wave gearbox, dual encoders and an on-board position-controlled driver, validated in Ansys.",
      season: "Fall 2026", sort: "2026-10",
      own: "solo", role: "Sole designer",
      team: "",
      tools: "SolidWorks · Ansys Mechanical",
      status: "In development",
      cover: "assets/img/integrated-actuator/section-a-sm.webp",
      tags: ["Frameless BLDC", "Strain wave", "Dual encoders", "Ansys"],
      skills: ["arms", "mechanisms", "fea", "embedded"],
      updates: [
        { date: "2026-10-04", text: "Coupled steady-state thermal → static structural study completed in Ansys Mechanical." },
        { date: "2026-09-06", text: "Section layout revised; encoder and driver electronics repackaged." }
      ]
    },
    {
      slug: "yam-arm", dwg: "04", category: "manip", scale: "major",
      title: "Re-engineering the i2rt YAM Arm",
      summary: "Reverse-engineered a popular low-cost research arm part by part in SolidWorks to stand up an independent supply chain for manufacturing it at scale.",
      season: "Summer 2026", sort: "2026-07",
      own: "solo", role: "Reverse engineering, full CAD & supply-chain setup",
      team: "Industry project",
      tools: "SolidWorks · Metrology · Vendor sourcing",
      status: "Complete",
      cover: "assets/img/yam-arm/render-rebuilt-sm.webp",
      tags: ["Reverse engineering", "DFM", "Supply chain", "VLA hardware"],
      skills: ["arms", "fab"],
      updates: [
        { date: "2026-07-06", text: "Complete arm assembly re-modeled in SolidWorks." }
      ]
    },
    {
      slug: "rap-gripper", dwg: "05", category: "manip", scale: "standard",
      title: "Rack-and-Pinion Parallel Gripper",
      summary: "A parallel-jaw gripper actuated by a rack and pinion, designed in Onshape and strong enough to hold a cordless drill.",
      season: "Summer 2026", sort: "2026-08",
      own: "solo", role: "Sole designer",
      team: "",
      tools: "Onshape · 3D printing",
      status: "Complete",
      cover: "assets/img/rap-gripper/bench-sm.webp",
      video: true,
      tags: ["Rack & pinion", "Parallel jaw", "Onshape"],
      skills: ["arms", "mechanisms", "embedded"],
      updates: [
        { date: "2026-09-12", text: "Grip test: the gripper holds an 18 V cordless drill with its battery." }
      ]
    },
    {
      slug: "wrist-3dof", dwg: "06", category: "mech", scale: "major", featured: true,
      title: "3-DoF Coaxial-Swerve Wrist",
      summary: "A wrist with all three motors below the joint: a modified coaxial swerve drives a differential, decoupled in software by a 3×3 kinematic transform I derived.",
      season: "Summer 2025", sort: "2025-07",
      own: "solo", role: "Concept, design, kinematics & control",
      team: "",
      tools: "SolidWorks · 3D printing · Kinematics",
      status: "Complete",
      cover: "assets/img/wrist-3dof/gears-sm.webp",
      featureMedia: "assets/video/wrist-demo.mp4", featurePoster: "assets/video/wrist-demo-poster.jpg",
      video: true,
      tags: ["Coaxial swerve", "Differential", "Remote actuation", "Kinematics"],
      skills: ["mechanisms", "controls", "arms"],
      updates: []
    },
    {
      slug: "planetary-coupling", dwg: "07", category: "mech", scale: "major",
      title: "Planetary Coupling",
      summary: "A novel two-input, two-output planetary differential that stacks one rotation on top of another, here used to change a coupling's eccentricity while it spins.",
      season: "Summer 2025", sort: "2025-07",
      own: "solo", role: "Inventor & sole designer",
      team: "",
      tools: "SolidWorks · 3D printing",
      status: "Complete",
      cover: "assets/img/planetary-coupling/prototype-sm.webp",
      video: true,
      tags: ["Planetary gearing", "Differential", "Concentric shafts"],
      skills: ["mechanisms"],
      updates: []
    },
    {
      slug: "bamf", dwg: "08", category: "mech", scale: "major",
      title: "BAMF: Backlash & Friction Compensation",
      summary: "A test rig with swappable backlash and friction 'inducers' and a model-based controller that cut tracking error by ~50% versus tuned PID.",
      season: "Spring 2026", sort: "2026-05",
      own: "co", role: "Test-apparatus designer; co-developed models & controller",
      team: "ES 259 · with Anna Burgess",
      tools: "SolidWorks · Arduino IDE · MATLAB · 3D printing",
      status: "Complete",
      cover: "assets/img/bamf/rig-render-sm.webp",
      tags: ["Backlash", "Coulomb friction", "Feedforward", "System ID"],
      skills: ["controls", "test", "embedded", "mechanisms"],
      updates: []
    },
    {
      slug: "bevel-gear-generator", dwg: "09", category: "mech", scale: "standard",
      title: "Parametric Spiral Bevel Gear Generator",
      summary: "An equation-driven SolidWorks part that generates a perfectly meshing spiral bevel gear pair from tooth count, pitch, pressure angle and spiral angle.",
      season: "Summer 2025", sort: "2025-06",
      own: "solo", role: "Sole author",
      team: "",
      tools: "SolidWorks equations · 3D sketches · Surfacing",
      status: "Complete",
      cover: "assets/img/bevel-gear-generator/render-sm.webp",
      tags: ["Gear geometry", "Tredgold", "Parametric CAD", "Surfacing"],
      skills: ["mechanisms"],
      updates: []
    },
    {
      slug: "pangolin-tag", dwg: "10", category: "research", scale: "major", featured: true,
      title: "Pangolin GPS Tag Enclosures",
      summary: "Multiple waterproof enclosure designs for a GPS/IMU/altitude tag for African pangolins, plus Instron testing of the adhesive attachment.",
      season: "Summer 2026", sort: "2026-08",
      own: "solo", role: "Enclosure design & attachment testing",
      team: "Harvard Microrobotics Lab",
      tools: "SolidWorks · SLA printing · Instron testing",
      status: "Ongoing",
      cover: "assets/img/pangolin-tag/versions-sm.webp",
      tags: ["Biologging", "Waterproofing", "Adhesion testing", "Instron"],
      skills: ["test", "fab"],
      updates: [
        { date: "2026-08-06", text: "Enclosure-scale adhesive pull tests run on the Instron." },
        { date: "2026-07-30", text: "Textured-shell enclosure assembled with its GPS patch antenna." }
      ]
    },
    {
      slug: "pangolin-camera-tag", dwg: "11", category: "research", scale: "standard",
      title: "Pangolin Camera Tag",
      summary: "An animal-borne camera prototype: a small Arducam enclosure plus STM32 firmware that captures JPEGs on a timer for intermittent, low-power imaging.",
      season: "Fall 2025", sort: "2025-12",
      own: "solo", role: "Enclosure design & firmware",
      team: "Harvard Microrobotics Lab",
      tools: "STM32CubeIDE · C · SolidWorks",
      status: "Complete",
      cover: "assets/img/pangolin-camera-tag/on-model-sm.webp",
      tags: ["Embedded C", "Firmware", "Camera", "Biologging"],
      skills: ["embedded", "test"],
      updates: []
    },
    {
      slug: "dea-spray-gantry", dwg: "12", category: "research", scale: "standard",
      title: "DEA Electrode Spray Gantry",
      summary: "An enclosed spray gantry for fabricating dielectric-elastomer-actuator electrodes, with a vacuum plate, fluid trough, drainage and a sealed door.",
      season: "Summer 2025", sort: "2025-07",
      own: "solo", role: "Sole designer",
      team: "Harvard Microrobotics Lab",
      tools: "SolidWorks · Laser cutting",
      status: "Complete",
      cover: "assets/img/dea-spray-gantry/enclosure-sm.webp",
      tags: ["Lab automation", "Vacuum fixturing", "Enclosure"],
      skills: ["fab", "mechanisms"],
      updates: []
    },
    {
      slug: "rocket-test-stand", dwg: "13", category: "research", scale: "standard",
      title: "800 lbf Liquid Rocket Test Stand",
      summary: "A vertical static-fire stand for an 800 lbf liquid bipropellant engine: aluminum structure, steel blast plate, validated in SolidWorks Simulation.",
      season: "Spring 2025", sort: "2025-04",
      own: "solo", role: "Stand designer",
      team: "Harvard Rocket Propulsion Group",
      tools: "SolidWorks · SolidWorks Simulation",
      status: "Complete",
      cover: "assets/img/rocket-test-stand/field-sm.webp",
      tags: ["Propulsion", "Structures", "FEA"],
      skills: ["fea", "test"],
      updates: []
    },
    {
      slug: "interferometer", dwg: "14", category: "research", scale: "standard",
      title: "Surface-Profiling Laser Interferometer",
      summary: "A Michelson interferometer that reads an object's surface gradient as it is dragged across the translating mirror.",
      season: "Fall 2025", sort: "2025-11",
      own: "solo", role: "Design, alignment & measurement",
      team: "Physics lab final project",
      tools: "Optical alignment · ThorCam",
      status: "Complete",
      cover: "assets/img/interferometer/fringes-wall-sm.webp",
      tags: ["Optics", "Metrology", "Alignment"],
      skills: ["test"],
      updates: []
    },
    {
      slug: "frc-duality", dwg: "15", category: "competition", scale: "standard",
      title: "FRC 125 “Duality”: 2nd in the World, 2023",
      summary: "In my first FRC season I designed the elevator gearbox and the cone-and-cube end effector for a robot that won its division championship and placed second in the world finals.",
      season: "Spring 2023", sort: "2023-04",
      own: "team", role: "Designed elevator gearbox & end effector",
      team: "FRC Team 125 NUTRONs",
      tools: "SolidWorks · CNC machining",
      status: "Complete",
      cover: "assets/img/frc-duality/winners-sm.webp",
      tags: ["FRC", "Gearbox", "End effector", "2nd in the world"],
      skills: ["mechanisms", "arms"],
      updates: []
    },
    {
      slug: "frc-momentum", dwg: "16", category: "competition", scale: "standard",
      title: "FRC 125 “Momentum”: Amp & Trap Scorer",
      summary: "The roller module that scored in both the Amp and the endgame Trap for a robot that won two district events and set scoring records.",
      season: "Spring 2024", sort: "2024-04",
      own: "team", role: "Designed the amp/trap scoring module",
      team: "FRC Team 125 NUTRONs",
      tools: "SolidWorks",
      status: "Complete",
      cover: "assets/img/frc-momentum/amp-rollers-sm.webp",
      tags: ["FRC", "Roller mechanism", "Game-piece handling"],
      skills: ["mechanisms"],
      updates: []
    },
    {
      slug: "glitterbot", dwg: "17", category: "competition", scale: "standard",
      title: "GlitterBot: Best CAD Award",
      summary: "A ramp-climbing course robot with a belt-linked all-wheel drive and a low-profile extending claw; it won the class's Best CAD award.",
      season: "Spring 2025", sort: "2025-04",
      own: "team", role: "Robot designer (CAD)",
      team: "ES 51 · team of 5",
      tools: "SolidWorks · Laser cutting · 3D printing",
      status: "Complete",
      cover: "assets/img/glitterbot/robot-sm.webp",
      tags: ["Best CAD award", "Four-bar claw", "AWD"],
      skills: ["mechanisms", "fab"],
      updates: []
    },
    {
      slug: "ftc-nobles", dwg: "18", category: "competition", scale: "compact",
      title: "Noble and Greenough FTC: Cascading Slide & Swerve",
      summary: "A cascading linear slide for a high-school FTC robot, plus build work on a DC-motor / servo-azimuth swerve drive.",
      season: "Fall 2023", sort: "2023-12",
      own: "team", role: "Designed the cascading slide; built swerve",
      team: "The Noble and Greenough School · FIRST Tech Challenge",
      tools: "SolidWorks",
      status: "Complete",
      cover: "assets/img/ftc-nobles/robot-cad-sm.webp",
      tags: ["FTC", "Linear slide", "Swerve"],
      skills: ["mechanisms"],
      updates: []
    },
    {
      slug: "machined-vise", dwg: "19", category: "fab", scale: "compact",
      title: "Machined Vise",
      summary: "A steel-and-brass machinist's vise made as a training project on the manual mill, manual lathe and a conversational CNC mill.",
      season: "Summer 2025", sort: "2025-08",
      own: "solo", role: "Machinist",
      team: "",
      tools: "Manual mill · Manual lathe · Conversational CNC",
      status: "Complete",
      cover: "assets/img/machined-vise/vise-sm.webp",
      tags: ["Machining", "Turning", "Milling"],
      skills: ["fab"],
      updates: []
    },
    {
      slug: "fsae-seat", dwg: "20", category: "fab", scale: "compact",
      title: "FSAE Driver Seat Surface Model",
      summary: "A rules-compliant Formula SAE seat surfaced in SolidWorks, sliced into strips for hot-wire foam cutting as a plug for a carbon-fiber layup.",
      season: "Fall 2024", sort: "2024-11",
      own: "solo", role: "Surface modeling & manufacturing plan",
      team: "",
      tools: "SolidWorks surfacing",
      status: "Complete",
      cover: "assets/img/fsae-seat/surface-sm.webp",
      tags: ["Surfacing", "Composites", "Tooling"],
      skills: ["fab"],
      updates: []
    },
    {
      slug: "piper-model", dwg: "21", category: "fab", scale: "compact",
      title: "Piper Seminole RC Model",
      summary: "A twin-engine RC airplane modeled after the Piper Seminole. The flight didn't go to plan; the CAD came out great.",
      season: "High school", sort: "2024-06",
      own: "solo", role: "Sole designer",
      team: "",
      tools: "SolidWorks",
      status: "Complete",
      cover: "assets/img/piper-model/cad-sm.webp",
      tags: ["Aircraft", "Surfacing"],
      skills: ["fab"],
      updates: []
    }
  ]
};
