
import { Download, ClipboardList } from "lucide-react";
export default function BackgroundTab(){
    const education = [
        {
            school: 'Royal University of Phnom Penh',
            degree: 'Bachelor of Information Technology',
            year: '2023- PRESENT',
            logo: "/images/rupp.png" 
        },
        {
            school: 'Korea Spftware HRD Center',
            degree: 'Bachelor of Information Technology',
            year: '2023- PRESENT',
            logo:"/images/hrdLogo.webp" 
        },
        {
            school: 'Institute of Foreign Languages',
            degree: 'Bachelor of English',
            year: '2023- PRESENT',
            logo: "/images/IFL.png"
        }
    ];
    const skills = [ 'React.js', 'Next.js', 'Node.js', 'Express.js', 'MongoDB' ];
    return(
        <div className="space-y-8">
            <section>
                <h3 className="type-subtitle-24 text-primary mb-6">Education</h3>
                <div className="space-y-6">
                    {education.map((edu,index)=> (
                        <div key={index} className="flex gap-4 items-start pb-6 border-b border-border last:border-0 last:pb-0">
                            <div className="w-12 h-12 rounded-lg border border-border bg-grey-50 flex items-center justify-center shrink-0 overflow-hidden relative">
                                <img 
                                src={edu.logo} 
                                alt={edu.school}  
                                className="w-full h-full object-cover" 
                                />
                            </div>
                            <div>
                                <h4 className="type-detail-semibold text-secondary">{edu.degree}</h4>
                                <p className="type-desc-semibold text-primary">{edu.school}</p>
                                <p className="type-detail-small-medium text-muted-foreground mt-1">{edu.year}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </section>
          <section>
        <h3 className="type-subtitle text-primary mb-4">Skill</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span 
              key={skill} 
              className="bg-muted text-primary px-3 py-1.5 rounded-full type-desc-small-semibold transition-colors duration-150 hover:bg-grey-100"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
            <section>
                <h3 className="type-subtitle-24 text-primary mb-4">Resume</h3>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-grey-50 group cursor-pointer hover:border-primary transition-colors">
                    <div className="flex items-center gap-3">
                        <ClipboardList size={20} className="text-secondary group-hover:text-primary transition-colors shrink-0" />
                        <span className="type-desc-medium text-secondary">CV_sonnika_shii.pdf</span>

                    </div>
                    <Download size={20} className="text-secondary group-hover:text-primary transition-colors" />

                </div>
            </section>

        </div>
     
    )
}