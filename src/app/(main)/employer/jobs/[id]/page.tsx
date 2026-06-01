"use client";

import { useMemo, useState } from "react";

import Image from "next/image";

import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  DollarSign,
  FileText,
  GraduationCap,
  Link2,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";

import { type CandidateProfile, CandidateProfileModal } from "@/components/candidate-profile-modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
  salary: "$50k-80k/month",
  location: "New York, USA",
  jobType: "Full Time",
  experience: "10-15 Years",
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

export default function EmployerJobDetailPage({ params: _params }: { params: { id: string } }) {
  const [level, setLevel] = useState("Mid Level");
  const [experience, setExperience] = useState("2-4 years");
  const [education, setEducation] = useState<string[]>(["Graduation"]);
  const [page, setPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null);

  const filteredCandidates = useMemo(() => {
    return sampleCandidates.filter((candidate) => {
      if (level && level !== "All" && candidate.level !== level) return false;
      if (experience && experience !== "All" && !candidate.experienceRange.startsWith(experience.split(" ")[0]))
        return false;
      if (education.length && !education.includes(candidate.education) && !education.includes("All")) return false;
      return true;
    });
  }, [level, experience, education]);

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
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex gap-4">
                  {/* Company Logo */}
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-muted">
                    <Image fill src={jobDetails.companyLogoUrl} alt={jobDetails.company} className="object-cover" />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h1 className="font-semibold text-2xl">{jobDetails.title}</h1>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 text-sm">
                          {jobDetails.jobType}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
                        <a
                          href={jobDetails.companyLink}
                          className="inline-flex items-center gap-1.5 text-primary hover:underline"
                        >
                          <Link2 className="size-4" />
                          {jobDetails.companyLink}
                        </a>
                        <div className="inline-flex items-center gap-1.5">
                          <Phone className="size-4" />
                          {jobDetails.phone}
                        </div>
                        <div className="inline-flex items-center gap-1.5">
                          <Mail className="size-4" />
                          {jobDetails.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-4 lg:justify-start">
                <Button className="h-10 w-60 gap-2 bg-sky-700 px-6 py-3 text-base">
                  Apply Now
                  <ArrowRight className="size-4" />
                </Button>
                <div className="text-right">
                  <div className="text-muted-foreground text-sm">
                    Job expire in: <span className="font-semibold text-red-500">{jobDetails.expiryDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              {/* Left: Description */}
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 font-semibold text-base">Job Description</h3>
                  <p className="text-muted-foreground text-sm leading-7">{jobDetails.description}</p>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-base">Responsibilities</h3>
                  <ul className="space-y-2">
                    {jobDetails.responsibilities.map((responsibility) => (
                      <li key={responsibility} className="flex gap-3 text-muted-foreground text-sm">
                        <span className="mt-1.5 flex h-2 w-2 flex-shrink-0 rounded-full bg-muted-foreground" />
                        {responsibility}
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
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays color="#0A65CC" className="size-6" />
                    </div>
                    <div className="font-semibold text-muted-foreground text-xs uppercase">Job Posted:</div>
                    <div className="font-medium text-sm">{jobDetails.posted}</div>
                  </div>
                  <div className="flex flex-col gap-1 py-4">
                    <div className="flex items-center gap-2 font-semibold text-muted-foreground text-xs uppercase">
                      <Clock3 color="#0A65CC" className="size-6" />
                    </div>
                    <div className="font-semibold text-muted-foreground text-xs uppercase">Job Expires In:</div>
                    <div className="font-medium text-sm">{jobDetails.expires}</div>
                  </div>
                  <div className="flex flex-col gap-1 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap color="#0A65CC" className="size-6" />
                    </div>
                    <div className="font-semibold text-muted-foreground text-xs uppercase">Education:</div>
                    <div className="font-medium text-sm">{jobDetails.education}</div>
                  </div>
                  <div className="flex flex-col gap-1 py-4">
                    <div className="flex items-center gap-2 font-semibold text-muted-foreground text-xs uppercase">
                      <DollarSign color="#0A65CC" className="size-6" />
                    </div>
                    <div className="font-semibold text-muted-foreground text-xs uppercase">Salary:</div>
                    <div className="font-medium text-sm">{jobDetails.salary}</div>
                  </div>
                  <div className="flex flex-col gap-1 py-4">
                    <div className="flex items-center gap-2 font-semibold text-muted-foreground text-xs uppercase">
                      <MapPin color="#0A65CC" className="size-6" />
                    </div>
                    <div className="font-semibold text-muted-foreground text-xs uppercase">Location:</div>
                    <div className="font-medium text-sm">{jobDetails.location}</div>
                  </div>
                  <div className="flex flex-col gap-1 py-4">
                    <div className="flex items-center gap-2 font-semibold text-muted-foreground text-xs uppercase">
                      <FileText color="#0A65CC" className="size-6" />
                    </div>
                    <div className="font-semibold text-muted-foreground text-xs uppercase">Job Type:</div>
                    <div className="font-medium text-sm">{jobDetails.jobType}</div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-1 py-4">
                  <div className="flex items-center gap-2 font-semibold text-muted-foreground text-xs uppercase">
                    <BriefcaseBusiness color="#0A65CC" className="size-6" />
                  </div>
                  <div className="font-semibold text-muted-foreground text-xs uppercase">Experience:</div>
                  <div className="font-medium text-sm">{jobDetails.experience}</div>
                </div>
              </div>
            </div>
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
                          checked={level === option.value}
                          onChange={() => setLevel(option.value)}
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
                          checked={experience === option}
                          onChange={() => setExperience(option)}
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
