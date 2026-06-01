"use client";

import { useMemo, useState } from "react";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import {
  ArrowLeft,
  ArrowRight,
  Bold,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  DollarSign,
  FileText,
  GraduationCap,
  Italic,
  Link2,
  List,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Strikethrough,
  Underline,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { type CandidateProfile, CandidateProfileModal } from "@/components/candidate-profile-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const jobDetails = {
  title: "Senior UX Designer",
  company: "Instagram",
  companyLink: "https://instagram.com",
  companyLogoUrl: "https://cdn.simpleicons.org/instagram/E4405F",
  phone: "(406) 555-0120",
  email: "career@instagram.com",
  description:
    "Integer aliquet pretium consequat. Donec et sapien id leo accumsan pellentesque eget maximus tellus. Duis et est ac leo rhoncus tincidunt vitae vehicula augue. Donec in suscipit diam. Pellentesque quis justo sit amet arcu commodo sollicitudin. Integer finibus blandit condimentum.",
  responsibilities: [
    "Quisque semper gravida est et consectetur.",
    "Curabitur blandit lorem velit, vitae pretium leo placerat eget.",
    "Morbi mattis in ipsum ac tempus.",
    "Curabitur eu vehicula libero. Vestibulum sed purus ullamcorper, lobortis lectus nec.",
    "vulputate turpis. Quisque ante odio, iaculis a porttitor sit amet.",
    "lobortis vel lectus. Nulla at risus ut diam.",
    "commodo feugiat. Nullam laoreet, diam placerat dapibus tincidunt.",
    "odio metus posuere lorem, id condimentum erat velit nec neque.",
    "dui sodales ut. Curabitur tempus augue.",
  ],
  posted: "14 June, 2021",
  expires: "14 July, 2021",
  expiryDate: "June 30, 2021",
  education: "Graduation",
  salary: "$8000 - $10000",
  location: "New York, USA",
  jobType: "Full time",
  experience: "10-15 years",
};

const sampleCandidates = [
  {
    name: "Jane Cooper",
    title: "Senior UX Designer",
    location: "New York",
    experience: "3 years",
    experienceRange: "2-4",
    education: "Graduation",
    level: "Mid Level",
    gender: "Female",
    distance: 12,
  },
  {
    name: "Cody Fisher",
    title: "Marketing Officer",
    location: "New York",
    experience: "4 years",
    experienceRange: "4-6",
    education: "Bachelor Degree",
    level: "Mid Level",
    gender: "Male",
    distance: 32,
  },
  {
    name: "Darrell Steward",
    title: "Interaction Designer",
    location: "New York",
    experience: "2 years",
    experienceRange: "1-3",
    education: "Graduation",
    level: "Mid Level",
    gender: "Male",
    distance: 18,
  },
  {
    name: "Guy Hawkins",
    title: "Junior Graphic Designer",
    location: "New York",
    experience: "1 year",
    experienceRange: "1-3",
    education: "Bachelor Degree",
    level: "Entry Level",
    gender: "Male",
    distance: 5,
  },
  {
    name: "Theresa Webb",
    title: "Front End Developer",
    location: "New York",
    experience: "5 years",
    experienceRange: "4-6",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 28,
  },
  {
    name: "Kathryn Murphy",
    title: "Technical Support Specialist",
    location: "New York",
    experience: "3 years",
    experienceRange: "2-4",
    education: "Graduation",
    level: "Mid Level",
    gender: "Female",
    distance: 22,
  },
  {
    name: "Marvin McKinney",
    title: "UI/UX Designer",
    location: "New York",
    experience: "4 years",
    experienceRange: "4-6",
    education: "Graduation",
    level: "Expert Level",
    gender: "Male",
    distance: 15,
  },
  {
    name: "Jenny Wilson",
    title: "Marketing Manager",
    location: "New York",
    experience: "6 years",
    experienceRange: "6-8",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 40,
  },
  {
    name: "Leslie Alexander",
    title: "Project Manager",
    location: "New York",
    experience: "8 years",
    experienceRange: "6-8",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 44,
  },
  {
    name: "Wade Warren",
    title: "Software Engineer",
    location: "New York",
    experience: "7 years",
    experienceRange: "6-8",
    education: "Bachelor Degree",
    level: "Mid Level",
    gender: "Male",
    distance: 27,
  },
  {
    name: "Arlene McCoy",
    title: "Content Strategist",
    location: "New York",
    experience: "2 years",
    experienceRange: "1-3",
    education: "Graduation",
    level: "Entry Level",
    gender: "Female",
    distance: 8,
  },
  {
    name: "Courtney Henry",
    title: "Visual Designer",
    location: "New York",
    experience: "1 year",
    experienceRange: "1-3",
    education: "Intermediate",
    level: "Entry Level",
    gender: "Female",
    distance: 10,
  },
  {
    name: "Ralph Edwards",
    title: "UX Researcher",
    location: "New York",
    experience: "5 years",
    experienceRange: "4-6",
    education: "Graduation",
    level: "Mid Level",
    gender: "Male",
    distance: 20,
  },
  {
    name: "Bessie Cooper",
    title: "Product Designer",
    location: "New York",
    experience: "9 years",
    experienceRange: "8-10",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 37,
  },
  {
    name: "Kenneth Steward",
    title: "Visual Interface Designer",
    location: "New York",
    experience: "3 years",
    experienceRange: "2-4",
    education: "Graduation",
    level: "Mid Level",
    gender: "Male",
    distance: 14,
  },
  {
    name: "Rick Astley",
    title: "Customer Experience Specialist",
    location: "New York",
    experience: "2 years",
    experienceRange: "1-3",
    education: "Bachelor Degree",
    level: "Entry Level",
    gender: "Female",
    distance: 12,
  },
  {
    name: "Albert Flores",
    title: "Design Systems Lead",
    location: "New York",
    experience: "10 years",
    experienceRange: "10-15",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Male",
    distance: 45,
  },
  {
    name: "Joe Mama",
    title: "Brand Designer",
    location: "New York",
    experience: "4 years",
    experienceRange: "4-6",
    education: "Graduation",
    level: "Mid Level",
    gender: "Female",
    distance: 25,
  },
  {
    name: "Kristin Watson",
    title: "Research Lead",
    location: "New York",
    experience: "6 years",
    experienceRange: "6-8",
    education: "Bachelor Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 33,
  },
  {
    name: "Cameron Williamson",
    title: "Junior Product Designer",
    location: "New York",
    experience: "1 year",
    experienceRange: "1-3",
    education: "Graduation",
    level: "Entry Level",
    gender: "Male",
    distance: 9,
  },
  {
    name: "Jane Cooper2",
    title: "Senior UX Designer",
    location: "New York",
    experience: "3 years",
    experienceRange: "2-4",
    education: "Graduation",
    level: "Mid Level",
    gender: "Female",
    distance: 12,
  },
  {
    name: "Cody Fisher2",
    title: "Marketing Officer",
    location: "New York",
    experience: "4 years",
    experienceRange: "4-6",
    education: "Bachelor Degree",
    level: "Mid Level",
    gender: "Male",
    distance: 32,
  },
  {
    name: "Darrell Steward2",
    title: "Interaction Designer",
    location: "New York",
    experience: "2 years",
    experienceRange: "1-3",
    education: "Graduation",
    level: "Mid Level",
    gender: "Male",
    distance: 18,
  },
  {
    name: "Guy Hawkins2",
    title: "Junior Graphic Designer",
    location: "New York",
    experience: "1 year",
    experienceRange: "1-3",
    education: "Bachelor Degree",
    level: "Entry Level",
    gender: "Male",
    distance: 5,
  },
  {
    name: "Theresa Webb2",
    title: "Front End Developer",
    location: "New York",
    experience: "5 years",
    experienceRange: "4-6",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 28,
  },
  {
    name: "Kathryn Murphy2",
    title: "Technical Support Specialist",
    location: "New York",
    experience: "3 years",
    experienceRange: "2-4",
    education: "Graduation",
    level: "Mid Level",
    gender: "Female",
    distance: 22,
  },
  {
    name: "Marvin McKinney2",
    title: "UI/UX Designer",
    location: "New York",
    experience: "4 years",
    experienceRange: "4-6",
    education: "Graduation",
    level: "Expert Level",
    gender: "Male",
    distance: 15,
  },
  {
    name: "Jenny Wilson2",
    title: "Marketing Manager",
    location: "New York",
    experience: "6 years",
    experienceRange: "6-8",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 40,
  },
  {
    name: "Leslie Alexander2",
    title: "Project Manager",
    location: "New York",
    experience: "8 years",
    experienceRange: "6-8",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 44,
  },
  {
    name: "Wade Warren2",
    title: "Software Engineer",
    location: "New York",
    experience: "7 years",
    experienceRange: "6-8",
    education: "Bachelor Degree",
    level: "Mid Level",
    gender: "Male",
    distance: 27,
  },
  {
    name: "Arlene McCoy2",
    title: "Content Strategist",
    location: "New York",
    experience: "2 years",
    experienceRange: "1-3",
    education: "Graduation",
    level: "Entry Level",
    gender: "Female",
    distance: 8,
  },
  {
    name: "Courtney Henry2",
    title: "Visual Designer",
    location: "New York",
    experience: "1 year",
    experienceRange: "1-3",
    education: "Intermediate",
    level: "Entry Level",
    gender: "Female",
    distance: 10,
  },
  {
    name: "Ralph Edwards2",
    title: "UX Researcher",
    location: "New York",
    experience: "5 years",
    experienceRange: "4-6",
    education: "Graduation",
    level: "Mid Level",
    gender: "Male",
    distance: 20,
  },
  {
    name: "Bessie Cooper2",
    title: "Product Designer",
    location: "New York",
    experience: "9 years",
    experienceRange: "8-10",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 37,
  },
  {
    name: "Kenneth Steward2",
    title: "Visual Interface Designer",
    location: "New York",
    experience: "3 years",
    experienceRange: "2-4",
    education: "Graduation",
    level: "Mid Level",
    gender: "Male",
    distance: 14,
  },
  {
    name: "Rick Astley2",
    title: "Customer Experience Specialist",
    location: "New York",
    experience: "2 years",
    experienceRange: "1-3",
    education: "Bachelor Degree",
    level: "Entry Level",
    gender: "Female",
    distance: 12,
  },
  {
    name: "Albert Flores2",
    title: "Design Systems Lead",
    location: "New York",
    experience: "10 years",
    experienceRange: "10-15",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Male",
    distance: 45,
  },
  {
    name: "Joe Mama2",
    title: "Brand Designer",
    location: "New York",
    experience: "4 years",
    experienceRange: "4-6",
    education: "Graduation",
    level: "Mid Level",
    gender: "Female",
    distance: 25,
  },
  {
    name: "Kristin Watson2",
    title: "Research Lead",
    location: "New York",
    experience: "6 years",
    experienceRange: "6-8",
    education: "Bachelor Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 33,
  },
  {
    name: "Cameron Williamson2",
    title: "Junior Product Designer",
    location: "New York",
    experience: "1 year",
    experienceRange: "1-3",
    education: "Graduation",
    level: "Entry Level",
    gender: "Male",
    distance: 9,
  },
  {
    name: "Jane Cooper3",
    title: "Senior UX Designer",
    location: "New York",
    experience: "3 years",
    experienceRange: "2-4",
    education: "Graduation",
    level: "Mid Level",
    gender: "Female",
    distance: 12,
  },
  {
    name: "Cody Fisher3",
    title: "Marketing Officer",
    location: "New York",
    experience: "4 years",
    experienceRange: "4-6",
    education: "Bachelor Degree",
    level: "Mid Level",
    gender: "Male",
    distance: 32,
  },
  {
    name: "Darrell Steward3",
    title: "Interaction Designer",
    location: "New York",
    experience: "2 years",
    experienceRange: "1-3",
    education: "Graduation",
    level: "Mid Level",
    gender: "Male",
    distance: 18,
  },
  {
    name: "Guy Hawkins3",
    title: "Junior Graphic Designer",
    location: "New York",
    experience: "1 year",
    experienceRange: "1-3",
    education: "Bachelor Degree",
    level: "Entry Level",
    gender: "Male",
    distance: 5,
  },
  {
    name: "Theresa Webb3",
    title: "Front End Developer",
    location: "New York",
    experience: "5 years",
    experienceRange: "4-6",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 28,
  },
  {
    name: "Kathryn Murphy3",
    title: "Technical Support Specialist",
    location: "New York",
    experience: "3 years",
    experienceRange: "2-4",
    education: "Graduation",
    level: "Mid Level",
    gender: "Female",
    distance: 22,
  },
  {
    name: "Marvin McKinney3",
    title: "UI/UX Designer",
    location: "New York",
    experience: "4 years",
    experienceRange: "4-6",
    education: "Graduation",
    level: "Expert Level",
    gender: "Male",
    distance: 15,
  },
  {
    name: "Jenny Wilson3",
    title: "Marketing Manager",
    location: "New York",
    experience: "6 years",
    experienceRange: "6-8",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 40,
  },
  {
    name: "Leslie Alexander3",
    title: "Project Manager",
    location: "New York",
    experience: "8 years",
    experienceRange: "6-8",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 44,
  },
  {
    name: "Wade Warren3",
    title: "Software Engineer",
    location: "New York",
    experience: "7 years",
    experienceRange: "6-8",
    education: "Bachelor Degree",
    level: "Mid Level",
    gender: "Male",
    distance: 27,
  },
  {
    name: "Arlene McCoy3",
    title: "Content Strategist",
    location: "New York",
    experience: "2 years",
    experienceRange: "1-3",
    education: "Graduation",
    level: "Entry Level",
    gender: "Female",
    distance: 8,
  },
  {
    name: "Courtney Henry3",
    title: "Visual Designer",
    location: "New York",
    experience: "1 year",
    experienceRange: "1-3",
    education: "Intermediate",
    level: "Entry Level",
    gender: "Female",
    distance: 10,
  },
  {
    name: "Ralph Edwards3",
    title: "UX Researcher",
    location: "New York",
    experience: "5 years",
    experienceRange: "4-6",
    education: "Graduation",
    level: "Mid Level",
    gender: "Male",
    distance: 20,
  },
  {
    name: "Bessie Cooper3",
    title: "Product Designer",
    location: "New York",
    experience: "9 years",
    experienceRange: "8-10",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 37,
  },
  {
    name: "Kenneth Steward3",
    title: "Visual Interface Designer",
    location: "New York",
    experience: "3 years",
    experienceRange: "2-4",
    education: "Graduation",
    level: "Mid Level",
    gender: "Male",
    distance: 14,
  },
  {
    name: "Rick Astley3",
    title: "Customer Experience Specialist",
    location: "New York",
    experience: "2 years",
    experienceRange: "1-3",
    education: "Bachelor Degree",
    level: "Entry Level",
    gender: "Female",
    distance: 12,
  },
  {
    name: "Albert Flores3",
    title: "Design Systems Lead",
    location: "New York",
    experience: "10 years",
    experienceRange: "10-15",
    education: "Master Degree",
    level: "Expert Level",
    gender: "Male",
    distance: 45,
  },
  {
    name: "Joe Mama3",
    title: "Brand Designer",
    location: "New York",
    experience: "4 years",
    experienceRange: "4-6",
    education: "Graduation",
    level: "Mid Level",
    gender: "Female",
    distance: 25,
  },
  {
    name: "Kristin Watson3",
    title: "Research Lead",
    location: "New York",
    experience: "6 years",
    experienceRange: "6-8",
    education: "Bachelor Degree",
    level: "Expert Level",
    gender: "Female",
    distance: 33,
  },
  {
    name: "Cameron Williamson3",
    title: "Junior Product Designer",
    location: "New York",
    experience: "1 year",
    experienceRange: "1-3",
    education: "Graduation",
    level: "Entry Level",
    gender: "Male",
    distance: 9,
  },
];

const locationOptions = [
  { label: "All", value: "All" },
  { label: "Entry Level", value: "Entry Level" },
  { label: "Mid Level", value: "Mid Level" },
  { label: "Expert Level", value: "Expert Level" },
];

const experienceOptions = [
  "All",
  "Freshers",
  "1-2 years",
  "2-4 years",
  "4-6 years",
  "6-8 years",
  "8-10 years",
  "10-15 years",
  "15+ years",
];

const educationOptions = ["All", "High School", "Intermediate", "Graduation", "Master Degree", "Bachelor Degree"];

const _genderOptions = ["All", "Male", "Female", "Others"];

const candidateProfileData: CandidateProfile = {
  name: "Esther Howard",
  title: "Website Designer (UI/UX)",
  experience: "7 Years",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=EstherHoward",
  biography:
    "I've been passionate about graphic design and digital art from an early age with a keen interest in website and Mobile Application Usages. I can create high-quality and aesthetically pleasing designs in a quick turnaround time. Check out the portfolio section of my profile to see samples of my work and feel free to discuss your designing needs. I mostly use Adobe Photoshop, Illustrator, XD and Figma. *Website User Experience and Interface (UI/UX) Design - for all kinds of Professional and Personal websites. *Mobile Application User Experience and Interface Design - for all kinds of iOS/Android and Hybrid Mobile Applications. *Wireframe Designs.",
  coverLetter:
    "Dear Sir,\n\nI am writing to express my interest in the fourth grade instructional position that is currently available in the Fort Wayne Community School System. I learned of the opening through a notice posted on JobZone, IPFW's job database. I am confident that my academic background and curriculum development skills would be successfully utilized in this teaching position.\n\nI have just completed my Bachelor of Science degree in Elementary Education and have successfully completed Praxis I and Praxis II. During my student teaching experience, I developed and initiated a three-week curriculum sequence on animal species and earth resources. This collaborative unit involved working with three other third-grade teachers within my team, and culminated in a field trip to the Indianapolis Zoo Animal Research Unit.\n\nSincerely,\nEsther Howard",
  dateOfBirth: "14 June, 2021",
  nationality: "Bangladesh",
  maritalStatus: "Single",
  gender: "Male",
  education: "Master Degree",
  website: "www.estherhoward.com",
  location: "Beverly Hills, California 90202",
  phone: "+1-202-555-0141",
  email: "esther.howard@gmail.com",
};

type SampleCandidate = (typeof sampleCandidates)[number];

function CandidateCard({ candidate, onViewProfile }: { candidate: SampleCandidate; onViewProfile: () => void }) {
  return (
    <div className="group flex flex-col gap-4 rounded-3xl border border-border bg-background p-4 transition-all hover:border-sky-700 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
          <span className="font-semibold text-base text-slate-700 uppercase">
            {candidate.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </div>

        <div className="min-w-0">
          <div className="font-semibold text-base">{candidate.name}</div>
          <div className="text-muted-foreground text-sm">{candidate.title}</div>

          <div className="mt-3 flex flex-wrap gap-3 text-muted-foreground text-sm">
            <div className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" />
              <span>{candidate.location}</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <BriefcaseBusiness className="size-4" />
              <span>{candidate.experience} experience</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onViewProfile}
          className="h-10 gap-2 bg-sky-100 px-6 font-semibold text-sky-600 transition-all hover:bg-sky-700 hover:text-white group-hover:bg-sky-700 group-hover:text-white"
        >
          View Profile
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// ── shared option lists (match job/post/page.tsx exactly) ─────────────────────
const EDUCATION_OPTIONS = ["All", "High School", "Intermediate", "Graduation", "Master Degree", "Bachelor Degree"];
const EXPERIENCE_OPTIONS = ["All", "Freshers", "1-2 years", "2-4 years", "4-6 years", "6-8 years", "8-10 years", "10-15 years", "15+ years"];
const JOB_LEVEL_OPTIONS = ["Entry Level", "Mid Level", "Expert Level"];
const JOB_TYPE_OPTIONS = ["Full time", "Part time", "Internship", "Remote", "Temporary", "Contract based"];
const SALARY_OPTIONS = ["$50 - $1000", "$1000 - $2500", "$2500 - $4000", "$4000 - $6000", "$6000 - $8000", "$8000 - $10000", "$10000 - $15000", "$15000+"];

const EDITOR_MENU = [
  { label: "Bold",          Icon: Bold,          command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBold().run(),        active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("bold") },
  { label: "Italic",        Icon: Italic,        command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleItalic().run(),      active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("italic") },
  { label: "Underline",     Icon: Underline,     command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleUnderline().run(),   active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("underline") },
  { label: "Strikethrough", Icon: Strikethrough, command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleStrike().run(),      active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("strike") },
  { label: "Bullet list",   Icon: List,          command: (e: ReturnType<typeof useEditor>) => e?.chain().focus().toggleBulletList().run(),  active: (e: ReturnType<typeof useEditor>) => !!e?.isActive("bulletList") },
];

function RichEditor({ initialContent }: { initialContent: string }) {
  const editor = useEditor({
    extensions: [StarterKit, UnderlineExt],
    content: initialContent || "<p></p>",
    immediatelyRender: false,
  });
  const mounted = useMemo(() => Boolean(editor), [editor]);
  return (
    <div className="rounded-3xl border border-border bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b border-border/70 bg-slate-100 p-3">
        {EDITOR_MENU.map(({ label, Icon, command, active }) => (
          <Button
            key={label}
            type="button"
            variant={editor && active(editor) ? "secondary" : "outline"}
            size="sm"
            className="min-w-[3rem]"
            onClick={() => editor && command(editor)}
            disabled={!editor}
          >
            <Icon className="size-4" />
          </Button>
        ))}
      </div>
      <div className="min-h-[220px] rounded-b-3xl px-4 py-4">
        {mounted ? (
          <EditorContent
            editor={editor}
            className="min-h-[180px] focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_li]:list-item"
          />
        ) : (
          <Textarea readOnly value="Loading editor..." className="min-h-[180px]" />
        )}
      </div>
    </div>
  );
}

function EditJobForm({
  job,
  onSave,
  onCancel,
}: {
  job: typeof jobDetails;
  onSave: (updated: typeof jobDetails) => void;
  onCancel: () => void;
}) {
  const [jobTitle, setJobTitle] = useState(job.title);
  const [jobLocation, setJobLocation] = useState(job.location);
  const [education, setEducation] = useState(job.education);
  const [experience, setExperience] = useState(job.experience);
  const [jobType, setJobType] = useState(job.jobType);
  const [expiryDate, setExpiryDate] = useState(job.expiryDate);
  const [jobLevel, setJobLevel] = useState("Mid Level");
  const [salary, setSalary] = useState(job.salary);
  const [companyLink, setCompanyLink] = useState(job.companyLink);
  const [phone, setPhone] = useState(job.phone);
  const [email, setEmail] = useState(job.email);

  const editor = useEditor({
    extensions: [StarterKit, UnderlineExt],
    content: job.description || "<p></p>",
    immediatelyRender: false,
  });

  const editorIsMounted = useMemo(() => Boolean(editor), [editor]);

  const handleSave = () => {
    onSave({
      ...job,
      title: jobTitle,
      location: jobLocation,
      education,
      experience,
      jobType,
      expiryDate,
      expires: expiryDate,
      salary,
      companyLink,
      phone,
      email,
      description: editor?.getText() ?? job.description,
      responsibilities: job.responsibilities,
    });
  };

  return (
    <div className="space-y-0">
      <div className="mb-8 flex items-center justify-between">
        <div className="text-3xl font-semibold">Edit Job</div>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="size-5" />
        </Button>
      </div>

      {/* Basic info */}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="job-title">Job Title</Label>
          <Input
            id="job-title"
            placeholder="Add job title, role, vacancies etc"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="h-10"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="job-location">Job Location</Label>
          <Textarea
            id="job-location"
            placeholder="Add job location"
            className="min-h-[80px]"
            value={jobLocation}
            onChange={(e) => setJobLocation(e.target.value)}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="company-link">Company Website</Label>
            <Input id="company-link" value={companyLink} onChange={(e) => setCompanyLink(e.target.value)} className="h-10" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input id="edit-phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-10" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-10" />
          </div>
        </div>
      </div>

      {/* Advanced Information */}
      <div className="mt-10 grid gap-2">
        <div className="mb-4 text-lg font-semibold">Advanced Information</div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label>Education</Label>
            <Select value={education} onValueChange={setEducation}>
              <SelectTrigger className="w-full py-5"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {EDUCATION_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Year of Experience</Label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger className="w-full py-5"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {EXPERIENCE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Job Type</Label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="w-full py-5"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {JOB_TYPE_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label>Expiration Date</Label>
            <Input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="py-5"
            />
          </div>
          <div className="grid gap-2">
            <Label>Job Level</Label>
            <Select value={jobLevel} onValueChange={setJobLevel}>
              <SelectTrigger className="w-full py-5"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {JOB_LEVEL_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Salary</Label>
            <Select value={salary} onValueChange={setSalary}>
              <SelectTrigger className="w-full py-5"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {SALARY_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Description & Responsibility */}
      <div className="mt-10">
        <div className="mb-4 text-lg font-semibold">Description &amp; Responsibility</div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <div className="rounded-3xl border border-border bg-white shadow-sm">
            <div className="flex flex-wrap gap-2 border-b border-border/70 bg-slate-100 p-3">
              {EDITOR_MENU.map(({ label, Icon, command, active }) => (
                <Button
                  key={label}
                  type="button"
                  variant={editor && active(editor) ? "secondary" : "outline"}
                  size="sm"
                  className="min-w-[3rem]"
                  onClick={() => editor && command(editor)}
                  disabled={!editor}
                >
                  <Icon className="size-4" />
                </Button>
              ))}
            </div>
            <div className="min-h-[220px] rounded-b-3xl px-4 py-4">
              {editorIsMounted ? (
                <EditorContent
                  editor={editor}
                  className="min-h-[180px] focus:outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_li]:list-item"
                />
              ) : (
                <Textarea readOnly value="Loading editor..." className="min-h-[180px]" />
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-10" />

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 py-6 text-base" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1 bg-sky-700 py-6 text-base font-semibold hover:bg-sky-800" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export default function EmployerJobDetailPage({ params: _params }: { params: { id: string } }) {
  const [isEditing, setIsEditing] = useState(false);
  const [job, setJob] = useState(jobDetails);

  const [filterLevel, setFilterLevel] = useState("Mid Level");
  const [filterExperience, setFilterExperience] = useState("2-4 years");
  const [education, setEducation] = useState<string[]>(["Graduation"]);
  const [page, setPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  const handleSave = (updated: typeof jobDetails) => {
    setJob(updated);
    setIsEditing(false);
    toast.success("Job updated successfully.");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const filteredCandidates = useMemo(() => {
    return sampleCandidates.filter((candidate) => {
      if (filterLevel && filterLevel !== "All" && candidate.level !== filterLevel) return false;
      if (filterExperience && filterExperience !== "All" && !candidate.experienceRange.startsWith(filterExperience.split(" ")[0]))
        return false;
      if (education.length && !education.includes(candidate.education) && !education.includes("All")) return false;
      return true;
    });
  }, [filterLevel, filterExperience, education]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filteredCandidates.length / pageSize));
  const currentCandidates = filteredCandidates.slice((page - 1) * pageSize, page * pageSize);

  const getVisiblePages = () => {
    const half = Math.floor(5 / 2);
    let start = Math.max(page - half, 1);
    let end = start + 5 - 1;

    if (end > pageCount) {
      end = pageCount;
      start = Math.max(end - 5 + 1, 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="justify-left flex w-full rounded-[0.5rem] bg-muted px-10 py-5 align-center font-semibold text-black text-lg">
        Job Details
      </div>
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          <section className="space-y-6 rounded-[2rem] border border-border bg-card p-6 shadow-sm lg:p-8">
            {isEditing ? (
              /* ── Edit mode ──────────────────────────────────────── */
              <EditJobForm job={job} onSave={handleSave} onCancel={handleCancel} />
            ) : (
              /* ── View mode ──────────────────────────────────────── */
              <>
                <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
                  <div className="flex flex-1 flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
                        <img src={job.companyLogoUrl} alt={job.company} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <h1 className="font-semibold text-2xl">{job.title}</h1>
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-sm">
                              {job.jobType}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                            <a href={job.companyLink} className="inline-flex items-center gap-1.5 text-primary hover:underline">
                              <Link2 className="size-4" />{job.companyLink}
                            </a>
                            <div className="inline-flex items-center gap-1.5"><Phone className="size-4" />{job.phone}</div>
                            <div className="inline-flex items-center gap-1.5"><Mail className="size-4" />{job.email}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4 lg:justify-start">
                    <Button onClick={() => setIsEditing(true)} className="h-10 w-60 gap-2 bg-sky-700 px-6 py-3 text-base">
                      <Pencil className="size-4" />
                      Edit Job
                    </Button>
                    <div className="text-right">
                      <div className="text-muted-foreground text-sm">
                        Job expire in: <span className="font-semibold text-red-500">{job.expiryDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 font-semibold text-base">Job Description</h3>
                      <p className="text-muted-foreground text-sm leading-7">{job.description}</p>
                    </div>
                    <div>
                      <h3 className="mb-3 font-semibold text-base">Responsibilities</h3>
                      <ul className="space-y-2">
                        {job.responsibilities.map((r) => (
                          <li key={r} className="flex gap-3 text-muted-foreground text-sm">
                            <span className="mt-1.5 flex h-2 w-2 flex-shrink-0 rounded-full bg-muted-foreground" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border bg-background p-6">
                    <h3 className="mb-4 font-semibold text-base">Job Overview</h3>
                    <Separator className="mb-4" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1 py-4">
                        <CalendarDays color="#0A65CC" className="size-6" />
                        <div className="font-semibold text-muted-foreground text-xs uppercase">Job Posted:</div>
                        <div className="font-medium text-sm">{job.posted}</div>
                      </div>
                      <div className="flex flex-col gap-1 py-4">
                        <Clock3 color="#0A65CC" className="size-6" />
                        <div className="font-semibold text-muted-foreground text-xs uppercase">Job Expires In:</div>
                        <div className="font-medium text-sm">{job.expires}</div>
                      </div>
                      <div className="flex flex-col gap-1 py-4">
                        <GraduationCap color="#0A65CC" className="size-6" />
                        <div className="font-semibold text-muted-foreground text-xs uppercase">Education:</div>
                        <div className="font-medium text-sm">{job.education}</div>
                      </div>
                      <div className="flex flex-col gap-1 py-4">
                        <DollarSign color="#0A65CC" className="size-6" />
                        <div className="font-semibold text-muted-foreground text-xs uppercase">Salary:</div>
                        <div className="font-medium text-sm">{job.salary}</div>
                      </div>
                      <div className="flex flex-col gap-1 py-4">
                        <MapPin color="#0A65CC" className="size-6" />
                        <div className="font-semibold text-muted-foreground text-xs uppercase">Location:</div>
                        <div className="font-medium text-sm">{job.location}</div>
                      </div>
                      <div className="flex flex-col gap-1 py-4">
                        <FileText color="#0A65CC" className="size-6" />
                        <div className="font-semibold text-muted-foreground text-xs uppercase">Job Type:</div>
                        <div className="font-medium text-sm">{job.jobType}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-col gap-1 py-4">
                      <BriefcaseBusiness color="#0A65CC" className="size-6" />
                      <div className="font-semibold text-muted-foreground text-xs uppercase">Experience:</div>
                      <div className="font-medium text-sm">{job.experience}</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <section className="mt-8 rounded-[2rem] border border-border bg-card p-6 shadow-sm lg:p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg text-muted-foreground uppercase tracking-[0.2em]">Filters</h2>
                </div>
                <div className="inline-flex w-60 items-center justify-center gap-2 rounded-2xl px-3 py-2 text-muted-foreground text-sm">
                  <Users className="size-4" />
                  {filteredCandidates.length} candidates
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3 rounded-3xl border border-border bg-background p-4">
                  <div className="mb-2 font-semibold text-foreground text-sm">Candidate Level</div>
                  <div className="grid gap-3">
                    {locationOptions.map((option) => (
                      <label
                        key={option.value}
                        className="inline-flex cursor-pointer items-center gap-3 rounded-2xl px-3 text-sm transition hover:border-primary/70"
                      >
                        <input
                          type="radio"
                          name="candidate-level"
                          value={option.value}
                          checked={filterLevel === option.value}
                          onChange={() => setFilterLevel(option.value)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl border border-border bg-background p-4">
                  <div className="mb-2 font-semibold text-foreground text-sm">Experiences</div>
                  <div className="grid gap-2">
                    {experienceOptions.map((option) => (
                      <label
                        key={option}
                        className="inline-flex cursor-pointer items-center gap-3 rounded-2xl px-3 text-sm transition hover:border-primary/70"
                      >
                        <input
                          type="radio"
                          name="candidate-experience"
                          value={option}
                          checked={filterExperience === option}
                          onChange={() => setFilterExperience(option)}
                          className="h-4 w-4 accent-primary"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 rounded-3xl border border-border bg-background p-4">
                  <div className="mb-2 font-semibold text-foreground text-sm">Education</div>
                  <div className="grid gap-2">
                    {educationOptions.map((option) => (
                      <label
                        key={option}
                        className="inline-flex cursor-pointer items-center gap-3 rounded-2xl px-3 text-sm transition hover:border-primary/70"
                      >
                        <input
                          type="checkbox"
                          value={option}
                          checked={education.includes(option)}
                          onChange={(event) => {
                            const value = event.target.value;
                            if (value === "All") {
                              setEducation(["All"]);
                              return;
                            }
                            setEducation((current) => {
                              const next = current.includes(value)
                                ? current.filter((item) => item !== value)
                                : [...current.filter((item) => item !== "All"), value];
                              return next.length ? next : ["All"];
                            });
                          }}
                          className="h-4 w-4 accent-primary"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="mt-8 rounded-[2rem] bg-card p-6 lg:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-lg text-muted-foreground uppercase tracking-[0.2em]">
                  Recommended Candidates
                </h2>
              </div>
            </div>

            <div className="grid gap-4">
              {currentCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.name}
                  candidate={candidate}
                  onViewProfile={() => setSelectedCandidate(candidateProfileData)}
                />
              ))}
            </div>

            <div className="mt-12 flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                className="size-10 rounded-full text-blue-400 hover:bg-blue-50 hover:text-blue-600"
                disabled={page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ArrowLeft className="size-6" />{" "}
              </Button>

              <div className="flex items-center gap-1">
                {visiblePages.map((pageNum) => {
                  const isCurrent = page === pageNum;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setPage(pageNum)}
                      className={`flex size-10 items-center justify-center rounded-full font-medium text-sm transition-colors ${
                        isCurrent
                          ? "bg-[#0061C2] text-white" // Target dark blue circle
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900" // Target gray hover
                      }
            `}
                    >
                      {String(pageNum).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="ghost"
                className="size-10 rounded-full text-blue-400 hover:bg-blue-50 hover:text-blue-600"
                disabled={page >= pageCount}
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
              >
                <ArrowRight className="size-6" />
              </Button>
            </div>
            <div className="text-muted-foreground text-sm">
              Page {page} of {pageCount}
            </div>
          </section>
        </div>
      </main>
      {selectedCandidate && (
        <CandidateProfileModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
      )}
    </div>
  );
}
