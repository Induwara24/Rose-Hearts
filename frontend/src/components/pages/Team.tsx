import { Linkedin, Github, Mail, Award } from "lucide-react";
import { Card } from "../ui/card";
import { ImageWithFallback } from "../figma/ImageWithFallback";

// --- 1. Import Local Images ---
// Assuming images are named after the team members and saved as .jpg in a local assets/team folder.
import induwaraImage from "../../assets/team/indu.jpg";
import januthmaImage from "../../assets/team/januthma.png";
import thiwankaImage from "../../assets/team/thiwanka.jpg";


export function Team() {
  const teamMembers = [
    {
      name: "Induwara Siriwardana",
      role: "AI Developer & Project Lead",
      description: "Leads the development of deep learning models and explainable AI systems. Expert in CNN architectures and medical image analysis.",
      // --- UPDATED to use imported local asset ---
      image: induwaraImage,
      linkedin: "https://www.linkedin.com/in/induwara-siriwardana/",
      github: "https://github.com/induwara24",
    },
    {
      name: "Januthma Dharmadasa",
      role: "Data Scientist",
      description: "Specializes in medical image preprocessing and feature extraction. Implements LIME and SHAP explainability techniques.",
      // --- UPDATED to use imported local asset ---
      image: januthmaImage,
      linkedin: "#",
      github: "#",
    },
    {
      name: "Thiwanka Ekanayaka",
      role: "Frontend Developer",
      description: "Builds intuitive user interfaces and implements real-time visualization for AI predictions and heatmaps.",
      // --- UPDATED to use imported local asset ---
      image: thiwankaImage,
      linkedin: "#",
      github: "#",
    },
  ];

  const supervisors = [
    {
      name: "Ms. Asanka Ranasinghe",
      title: "Lecturer, Department of Software Engineering, FoCIT",
      affiliation: "Sri Lanka Technology Campus",
    },
    {
      name: "Ms. Rusini Siyara Liyanachchi ",
      title: "Assistant Lecturer, Department of Software Engineering, FoCIT",
      affiliation: "Sri Lanka Technology Campus",
    },
    {
      name: "Dr. Akalanka Muthukumarana",
      title: "Surgical SHO in Breast Surgery",
      affiliation: "National Hospital of Sri Lanka, Karapitiya",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-peach-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-4">Meet Our Team</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            A dedicated team of researchers and developers working to advance breast cancer detection 
            through explainable artificial intelligence.
          </p>
        </div>

        {/* Project Members Section */}
        <div className="mb-16">
          <h2 className="text-gray-900 text-center mb-8">Project Members</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden bg-white border-pink-100 shadow-lg hover:shadow-xl transition-all group">
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <ImageWithFallback
                    // The value of member.image is now the imported string path
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-rose-600 text-sm">{member.role}</p>
                  </div>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.description}
                  </p>
                  
                  <div className="flex gap-3 pt-2">
                    <a
                      href={member.linkedin}
                      className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 hover:bg-rose-100 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={member.github}
                      className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 hover:bg-rose-100 transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href="mailto:team@rosehearts.ai"
                      className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 hover:bg-rose-100 transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Project Supervisors Section */}
        <div className="mb-12">
          <h2 className="text-gray-900 text-center mb-8">Project Supervisors</h2>
          <Card className="p-8 md:p-12 bg-white border-pink-100 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supervisors.map((supervisor, index) => (
                <div key={index} className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto">
                    <Award className="w-8 h-8 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">{supervisor.name}</h3>
                    <p className="text-gray-600 text-sm mb-1">{supervisor.title}</p>
                    <p className="text-rose-600 text-sm">{supervisor.affiliation}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Acknowledgment Section */}
        <Card className="p-8 md:p-12 bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-2xl shadow-pink-200 text-center">
          <h2 className="mb-4">Academic Project</h2>
          <p className="mb-4 opacity-90 max-w-2xl mx-auto">
            This project is being developed as part of advanced research in medical AI and 
            explainable artificial intelligence systems.
          </p>
          <p className="text-sm opacity-80">
            Sri Lanka Technology Campus | Faculty of Computing and IT
          </p>
        </Card>
      </div>
    </div>
  );
}