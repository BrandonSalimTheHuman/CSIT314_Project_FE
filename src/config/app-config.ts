import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "MyJob",
  version: packageJson.version,
  copyright: `© ${currentYear}, MyJob.`,
  meta: {
    title: "MyJob — Find Your Next Career Opportunity",
    description:
      "MyJob is a modern job portal connecting talented candidates with top employers. Upload your resume, discover matched job listings, and take the next step in your career — all in one place.",
  },
};
