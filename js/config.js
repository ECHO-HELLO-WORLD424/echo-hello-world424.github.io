/* ==========================================================================
   SITE CONFIG - edit this file to personalize the website.
   --------------------------------------------------------------------------
   Everything the site displays is read from here by js/main.js.
   No build step, no server needed: just edit, save and refresh.

   Quick guide:
     - siteTitle ......... browser tab, window title bar, taskbar button
     - osName/osVersion .. Start menu sidebar branding
      - profile ........... name / tagline / bio / scrolling marquee text;
                           bio is Markdown (paragraphs, **bold**, lists,
                           headings, links, `code`; two trailing spaces = <br>)
     - images ............ paths (or URLs) of banner, profile, background
     - emails ............ contact list; the FIRST entry is also used by
                           Start -> "E-mail me"
     - links ............. buttons in "Find Me On"; `icon` picks a built-in
                           16x16 pixel icon: github | scholar | discord |
                           openreview | mail | home (unknown -> link arrow)
     - visitorNumber ..... joke counter in the status bar
     - statusRight ....... rightmost status bar cell
     - dialogs ........... texts of the retro pop-ups
   ========================================================================== */

window.SITE_CONFIG = {
  siteTitle: "Patrick's Homepage",

  osName: 'Windows',
  osVersion: '95',

  profile: {
    name: 'Patrick',
    tagline: 'Undergraduate Student - Researcher - AI Infra/Embodied Intelligence',
    bio:
      "Hi there, and welcome to my homepage! I'm **Patrick**  \n" +
      'Currently undergraduate at The Grainger College of Engineering | UIUC\n' +
      '\n' +
      '**Field of interests:**\n' +
      '- AI Infra\n' +
      '- Embodied Intelligence\n' +
      '\n' +
      '**Skills:**\n' +
      '- Experience w/ CUDA C++, PyTorch/JAX\n' +
      '- ML pipeline optimization on multi-GPU clusters\n' +
      '- Experience w/ Transformer, DiT, VLA, JEPA, World Models\n',
    marquee:
      'CUDA C++, PyTorch/JAX * ' +
      'ML pipeline optimization on multi-GPU clusters * ' +
      'Transformer, DiT, VLA, WFM '
  },

  images: {
    banner: 'assets/img/banner.png',
    bannerAlt:
      "Pixel-art banner: a retro sunset over mountains with the text " +
      "'Patrick's Homepage'",
    profile: 'assets/img/profile.png',
    profileAlt: 'Patrick',
    background: 'assets/img/background.png',
  },

  /* first entry = the address used by Start -> "E-mail me" */
  emails: [
    { label: 'Personal', address: 'patrickechohelloworld@outlook.com' },
    { label: 'University', address: 'ziyu17@illinois.edu' },
    /* add more rows here, e.g.:*/
    { label: 'University', address: 'ziyu.24@intl.zju.edu.cn' }
    /* add more rows here, e.g.:
    { label: 'Work', address: 'me@company.com' }, */
  ],

  /* icon: github | scholar | discord | openreview | mail | home | link */
  links: [
    { label: 'GitHub', url: 'https://github.com/ECHO-HELLO-WORLD424', icon: 'github' },
    {
      label: 'Google Scholar',
      url: 'https://scholar.google.com/citations?user=y-09sqkAAAAJ&hl=en',
      icon: 'scholar',
    },
    {
      label: 'Discord',
      url: 'https://discord.com/users/patrick_echo_hello_world',
      icon: 'discord',
    },
    {
      label: 'OpenReview',
      url: 'https://openreview.net/profile?id=%7EZiyu_Patrick_Chen1',
      icon: 'openreview',
    },
    /* add more buttons here, e.g.:
    { label: 'Blog', url: 'https://blog.example.com', icon: 'link' }, */
  ],

  visitorNumber: '002501',
  statusRight: 'HTML 4.01 compliant',

  dialogs: {
    close:
      'Unknown error occurred.',
    menu:
      'This menu is purely decorative - this is a homepage, not a real app. ' +
      'Thanks for clicking though!',
    about:
      'A tiny retro homepage hand-built with HTML, CSS and JavaScript. ' +
      'No browsers were harmed.',
    shutdown:
      'It is now safe to turn off your computer. ' +
      '...',
  },
};
