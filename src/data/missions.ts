import moon from "@/assets/char-moon.jpg";
import mars from "@/assets/char-mars.jpg";
import deepSpace from "@/assets/char-deepspace.jpg";
import eagle from "@/assets/char-eagle.jpg";
import pathfinder from "@/assets/char-pathfinder.jpg";
import skyCrane from "@/assets/char-skycrane.jpg";
import surveyor3 from "@/assets/mission-surveyor3.jpg";
import apollo11 from "@/assets/mission-apollo11.jpg";
import moonBuggy from "@/assets/mission-moonbuggy.jpg";
import sojourner from "@/assets/mission-sojourner.jpg";
import curiosity from "@/assets/mission-curiosity.jpg";
import ingenuity from "@/assets/mission-ingenuity.jpg";
import pioneer10 from "@/assets/mission-pioneer10.jpg";
import voyager1 from "@/assets/mission-voyager1.jpg";

export type Tone = "sun" | "pink" | "sky" | "lime" | "orange" | "teal" | "coral" | "moon";

export type Speaker = {
  id: string;
  name: string;
  avatar: string;
  tone: Tone;
  /** Voice for "Read to me": robots squeak, planets rumble. */
  pitch: number;
  rate: number;
};

export const SPEAKERS = {
  surveyor3: { id: "surveyor3", name: "Surveyor 3", avatar: surveyor3, tone: "sky", pitch: 1.5, rate: 1.05 },
  moon: { id: "moon", name: "The Moon", avatar: moon, tone: "moon", pitch: 0.9, rate: 0.95 },
  neil: { id: "neil", name: "Neil Armstrong", avatar: apollo11, tone: "lime", pitch: 0.85, rate: 0.95 },
  eagle: { id: "eagle", name: "Eagle (Lunar Module)", avatar: eagle, tone: "coral", pitch: 1.2, rate: 1 },
  buggy: { id: "buggy", name: "Moon Buggy", avatar: moonBuggy, tone: "sun", pitch: 1.35, rate: 1.15 },
  sojourner: { id: "sojourner", name: "Sojourner", avatar: sojourner, tone: "teal", pitch: 1.6, rate: 1.05 },
  pathfinder: { id: "pathfinder", name: "Pathfinder (The Lander)", avatar: pathfinder, tone: "sky", pitch: 1.1, rate: 1 },
  mars: { id: "mars", name: "Mars", avatar: mars, tone: "orange", pitch: 0.8, rate: 0.95 },
  curiosity: { id: "curiosity", name: "Curiosity", avatar: curiosity, tone: "lime", pitch: 1.0, rate: 1.05 },
  skyCrane: { id: "skyCrane", name: "The Sky Crane", avatar: skyCrane, tone: "orange", pitch: 0.95, rate: 1 },
  ingenuity: { id: "ingenuity", name: "Ingenuity", avatar: ingenuity, tone: "pink", pitch: 1.8, rate: 1.15 },
  pioneer10: { id: "pioneer10", name: "Pioneer 10", avatar: pioneer10, tone: "sun", pitch: 0.9, rate: 0.95 },
  deepSpace: { id: "deepSpace", name: "Deep Space", avatar: deepSpace, tone: "teal", pitch: 0.7, rate: 0.85 },
  voyager1: { id: "voyager1", name: "Voyager 1", avatar: voyager1, tone: "sky", pitch: 1.25, rate: 1.05 },
} satisfies Record<string, Speaker>;

export type SpeakerId = keyof typeof SPEAKERS;

export type ChatLine = { speaker: SpeakerId; text: string };

export type Mission = {
  id: string;
  name: string;
  year: number;
  image: string;
  tone: Tone;
  /** Curiosity hook shown on the card, answered inside the story. */
  teaser: string;
  /** Speaker shown on the left of the chat; everyone else replies from the right. */
  host: SpeakerId;
  story: ChatLine[];
  history: string[];
  quickFacts: { label: string; value: string }[];
  funFact: string;
};

export type QuizQuestion = { question: string; options: string[]; answer: number; explain: string };

export type SortItem = { id: string; label: string; image?: string; bin: 0 | 1; why: string };

type GameBase = { id: string; title: string; intro: string };
export type ChapterGame =
  | (GameBase & { type: "landing"; craft: string; craftName: string })
  | (GameBase & { type: "quiz"; questions: QuizQuestion[] })
  | (GameBase & { type: "sorting"; bins: [string, string]; items: SortItem[] });

export type Chapter = {
  id: "moon" | "deep-space" | "mars";
  number: number;
  title: string;
  years: string;
  tagline: string;
  planet: string;
  planetName: string;
  tone: Tone;
  missions: Mission[];
  game: ChapterGame;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "moon",
    number: 1,
    title: "Lunar Missions",
    tagline: "Our closest neighbour — 384,400 km away. That's like driving around Earth almost 10 times!",
    planet: moon,
    planetName: "The Moon",
    tone: "moon",
    years: "1967 – 1971",
    game: {
      id: "moon-landing",
      type: "landing",
      title: "Land the Eagle!",
      intro: "You're the pilot! Hold the button to fire Eagle's rocket and slow down. Touch the Moon gently — slower than 3 m/s — before the fuel runs out.",
      craft: eagle,
      craftName: "Eagle",
    },
    missions: [
      {
        id: "surveyor-3",
        name: "Surveyor 3",
        year: 1967,
        image: surveyor3,
        tone: "sky",
        teaser: "Which robot bounced like a basketball on the Moon?",
        host: "surveyor3",
        story: [
          { speaker: "surveyor3", text: "Hold on a second, space fans! Before Neil Armstrong, I was already visiting the Moon in 1967... I bounced TWICE like a basketball before finally sitting still!" },
          { speaker: "moon", text: "Hey! You hopped right onto my surface and started digging with a tiny metal shovel! That tickles!" },
        ],
        history: [
          "Surveyor 3 was a NASA robotic lander launched on April 17, 1967. It touched down on April 20 in the Ocean of Storms, a huge dark plain on the Moon.",
          "Its engines didn't switch off right away, so the lander bounced across the surface before settling. Once still, it used a scoop on a robotic arm to dig small trenches and sent back more than 6,000 TV pictures.",
          "In 1969 the Apollo 12 astronauts landed nearby, walked over to Surveyor 3, and brought its camera home so scientists could study how parts survive on the Moon.",
        ],
        quickFacts: [
          { label: "Launched", value: "April 1967" },
          { label: "Landed at", value: "Ocean of Storms" },
          { label: "Photos sent", value: "6,000+" },
        ],
        funFact: "Its crushable landing pads taught NASA how to land safely.",
      },
      {
        id: "apollo-11",
        name: "Apollo 11",
        year: 1969,
        image: apollo11,
        tone: "lime",
        teaser: "Who flew on rocket power and was built super light?",
        host: "neil",
        story: [
          { speaker: "neil", text: "Hello, future explorers! I really did take those first historic steps on the Moon!" },
          { speaker: "eagle", text: "And I am Eagle! I flew on rocket power! Engineers made me super light to save fuel." },
        ],
        history: [
          "Apollo 11 launched on July 16, 1969 with three astronauts: Neil Armstrong, Buzz Aldrin and Michael Collins.",
          "On July 20, Armstrong and Aldrin landed the lunar module Eagle in the Sea of Tranquility while Collins circled overhead in the command module Columbia.",
          "Armstrong became the first person to walk on the Moon. The two moonwalkers spent about two and a half hours outside, planted a flag, set up experiments and collected 21.5 kg of Moon rocks.",
        ],
        quickFacts: [
          { label: "Landed", value: "July 20, 1969" },
          { label: "Crew", value: "3 astronauts" },
          { label: "Moon rocks", value: "21.5 kg" },
        ],
        funFact: "There's no wind on the Moon, so the astronauts' footprints are probably still there today — and could stay for millions of years!",
      },
      {
        id: "lunar-rover",
        name: "Lunar Roving Vehicle",
        year: 1971,
        image: moonBuggy,
        tone: "sun",
        teaser: "Who got a speeding warning from the Moon?",
        host: "buggy",
        story: [
          { speaker: "buggy", text: "We are the ultimate space rides! We let astronauts drive for miles!" },
          { speaker: "moon", text: "Whoa, slow down! You were zooming at 11 miles per hour across my craters!" },
        ],
        history: [
          "The Lunar Roving Vehicle was an electric, battery-powered car built for the Moon. It first drove on Apollo 15 in July 1971, then again on Apollo 16 and Apollo 17.",
          "It folded up flat to fit on the side of the lunar module, then unfolded on the Moon. Its wheels were made of woven wire mesh because rubber tyres wouldn't work in space.",
          "With the rover, astronauts could travel much farther from their landing spot and collect rocks from many places. All three rovers are still parked on the Moon.",
        ],
        quickFacts: [
          { label: "First drive", value: "July 1971" },
          { label: "Top speed", value: "≈ 11 mph" },
          { label: "Still on the Moon", value: "3 buggies" },
        ],
        funFact: "The Moon Buggy's wheels were made of springy wire mesh — like a metal basket — because air-filled tyres would pop in space!",
      },
    ],
  },
  {
    id: "deep-space",
    number: 2,
    title: "Deep Space",
    tagline: "Past the planets, where the Sun looks like just another star.",
    planet: deepSpace,
    planetName: "Deep Space",
    tone: "teal",
    years: "1972 – 1977",
    game: {
      id: "deep-quiz",
      type: "quiz",
      title: "Deep Space Brain Blast",
      intro: "Answer all 3 questions right in one go to win. One slip and you start again — you've got this!",
      questions: [
        {
          question: "How did Pioneer 10 stay awake so far from the Sun?",
          options: ["It took long naps", "Special batteries that don't need sunshine", "Giant mirrors"],
          answer: 1,
          explain: "Engineers gave Pioneer 10 special batteries that don't need sunshine!",
        },
        {
          question: "What did Earth look like in Voyager 1's famous photo?",
          options: ["A giant blue whale", "A shiny gold coin", "A tiny pale blue dot"],
          answer: 2,
          explain: "A Pale Blue Dot! All of Earth, just a tiny pixel in a sunbeam.",
        },
        {
          question: "Which giant planet did Pioneer 10 visit after crossing the Asteroid Belt?",
          options: ["Jupiter", "Earth", "The Moon"],
          answer: 0,
          explain: "Jupiter! Pioneer 10 sent the very first close-up pictures of it.",
        },
      ],
    },
    missions: [
      {
        id: "pioneer-10",
        name: "Pioneer 10",
        year: 1972,
        image: pioneer10,
        tone: "sun",
        teaser: "How does a spaceship stay awake without sunshine?",
        host: "pioneer10",
        story: [
          { speaker: "pioneer10", text: "I was the first spacecraft to safely cross the bumpy Asteroid Belt and visit Jupiter!" },
          { speaker: "deepSpace", text: "How do you stay awake out here?" },
          { speaker: "pioneer10", text: "Engineers gave me special batteries that don't need sunshine!" },
        ],
        history: [
          "Pioneer 10 launched on March 2, 1972. It became the first spacecraft to travel through the Asteroid Belt between Mars and Jupiter.",
          "In December 1973 it flew past Jupiter and sent back the first close-up pictures of the giant planet.",
          "Far from the Sun, solar panels don't work well, so Pioneer 10 used nuclear power generators. Its last faint signal reached Earth in 2003.",
        ],
        quickFacts: [
          { label: "Launched", value: "March 1972" },
          { label: "Visited", value: "Jupiter" },
          { label: "Last signal", value: "2003" },
        ],
        funFact: "Pioneer 10 carries a golden plaque with a drawing of humans and a map to Earth — a hello note in case aliens ever find it!",
      },
      {
        id: "voyager-1",
        name: "Voyager 1",
        year: 1977,
        image: voyager1,
        tone: "sky",
        teaser: "Who took a selfie of Earth from 3.7 billion miles away?",
        host: "voyager1",
        story: [
          { speaker: "voyager1", text: "I took a famous picture of Earth from 3.7 billion miles away. Earth looks like a tiny pale blue dot!" },
          { speaker: "deepSpace", text: "That's amazing! All of Earth, just a tiny pixel in a sunbeam." },
        ],
        history: [
          "Voyager 1 launched on September 5, 1977 and flew past Jupiter and Saturn, discovering volcanoes on Jupiter's moon Io.",
          "On February 14, 1990, it turned its camera back toward home and took the 'Pale Blue Dot' photo, showing Earth as a tiny speck about 3.7 billion miles away.",
          "In 2012 Voyager 1 became the first human-made object to reach interstellar space — the space between the stars. It is still sending messages home today.",
        ],
        quickFacts: [
          { label: "Launched", value: "Sept 1977" },
          { label: "Pale Blue Dot", value: "Feb 14, 1990" },
          { label: "Farthest spacecraft", value: "Yes!" },
        ],
        funFact: "Voyager 1 carries a Golden Record with sounds of Earth — music, laughter, a dog barking, and hellos in 55 languages!",
      },
    ],
  },
  {
    id: "mars",
    number: 3,
    title: "Mars Missions",
    tagline: "The Red Planet! It's red because its dust is full of rust.",
    planet: mars,
    planetName: "Mars",
    tone: "orange",
    years: "1997 – 2021",
    game: {
      id: "home-sort",
      type: "sorting",
      title: "Who Came Home?",
      intro: "Some space travellers flew back to Earth. Others are still out there today! Drag each one into the right box — or tap it, then tap a box.",
      bins: ["Came home to Earth", "Didn't make it home"],
      items: [
        { id: "astronauts", label: "The Apollo 11 astronauts", image: apollo11, bin: 0, why: "Neil, Buzz and Michael splashed down safely in the ocean in 1969." },
        { id: "camera", label: "Surveyor 3's camera", image: surveyor3, bin: 0, why: "Apollo 12 astronauts unscrewed it on the Moon and carried it home!" },
        { id: "rocks", label: "Moon rocks", bin: 0, why: "Apollo 11 brought 21.5 kg of Moon rocks back for scientists." },
        { id: "buggy", label: "The Moon Buggies", image: moonBuggy, bin: 1, why: "All three are still parked on the Moon." },
        { id: "voyager", label: "Voyager 1", image: voyager1, bin: 1, why: "It's still flying between the stars, farther than anything else." },
        { id: "sojourner", label: "Sojourner", image: sojourner, bin: 1, why: "It's still sitting on Mars where it finished exploring." },
      ],
    },
    missions: [
      {
        id: "sojourner",
        name: "Sojourner",
        year: 1997,
        image: sojourner,
        tone: "teal",
        teaser: "Which robot was the size of a microwave oven?",
        host: "sojourner",
        story: [
          { speaker: "sojourner", text: "I’m only the size of a microwave oven, but I was the very first wheeled robot on Mars!" },
          { speaker: "pathfinder", text: "And who carried you safely all the way from Earth? ME! I wrapped us in giant airbags!" },
          { speaker: "mars", text: "It’s strictly cool robots over here!" },
        ],
        history: [
          "The Mars Pathfinder mission landed on July 4, 1997 in a rocky flood plain called Ares Vallis. It used giant airbags to bounce safely onto the surface.",
          "Inside was Sojourner, a six-wheeled rover weighing just 10.6 kg — the first rover ever to drive on another planet.",
          "Sojourner rolled slowly from rock to rock, studying what they were made of, while the lander sent back thousands of pictures of Mars.",
        ],
        quickFacts: [
          { label: "Landed", value: "July 4, 1997" },
          { label: "Weight", value: "10.6 kg" },
          { label: "Wheels", value: "6" },
        ],
        funFact: "Sojourner's top speed was about 1 centimetre per second — slower than a snail on a sunny day!",
      },
      {
        id: "curiosity",
        name: "Curiosity",
        year: 2012,
        image: curiosity,
        tone: "lime",
        teaser: "Which rover has lasers on its head?",
        host: "curiosity",
        story: [
          { speaker: "curiosity", text: "The biggest rover is here! I’m the size of an SUV, and I have lasers on my head to study rocks!" },
          { speaker: "skyCrane", text: "And I helped you land! I hovered on rocket jets and lowered you down gently on ropes!" },
        ],
        history: [
          "Curiosity landed in Gale Crater on Mars on August 6, 2012. It's about the size of a small car and weighs around 900 kg.",
          "Because it was too heavy for airbags, a rocket-powered 'sky crane' hovered above the ground and lowered Curiosity on cables.",
          "Curiosity uses a laser called ChemCam to zap rocks and find out what they're made of. It discovered that Mars once had lakes that could have supported tiny life — and it's still exploring today!",
        ],
        quickFacts: [
          { label: "Landed", value: "Aug 2012" },
          { label: "Weight", value: "≈ 900 kg" },
          { label: "Still driving?", value: "Yes!" },
        ],
        funFact: "On its first birthday on Mars, Curiosity played 'Happy Birthday' to itself by vibrating its soil-scooping tool!",
      },
      {
        id: "ingenuity",
        name: "Ingenuity",
        year: 2021,
        image: ingenuity,
        tone: "pink",
        teaser: "Who broke the rules and flew 72 times?",
        host: "ingenuity",
        story: [
          { speaker: "ingenuity", text: "I’m the FIRST helicopter in history to fly on another planet!" },
          { speaker: "mars", text: "You were only supposed to make 5 test flights, little guy!" },
          { speaker: "ingenuity", text: "I know, but I loved flying so much I flew 72 TIMES!" },
        ],
        history: [
          "Ingenuity was a tiny helicopter that rode to Mars attached to the belly of the Perseverance rover.",
          "On April 19, 2021 it made the first powered, controlled flight on another planet. Mars' air is very thin, so its blades spun about 2,400 times a minute.",
          "It was planned as a 5-flight test, but Ingenuity kept going for almost three years and 72 flights, scouting paths for Perseverance.",
        ],
        quickFacts: [
          { label: "First flight", value: "April 19, 2021" },
          { label: "Weight", value: "1.8 kg" },
          { label: "Flights", value: "72" },
        ],
        funFact: "Ingenuity carried a tiny piece of fabric from the Wright brothers' first airplane — the very first plane to fly on Earth!",
      },
    ],
  }
];

export const ALL_MISSIONS: Mission[] = CHAPTERS.flatMap((c) => c.missions);
