//initial variabels
const projectsEl = document.querySelector('.random-projects');
const projectType = document.querySelector('.project-type').textContent.toLowerCase().trim();
let projectsArr = [];
let data = [];
let projectsToDisplay = 2;
let filteredProjects = [];
//fetch data from endpoint
async function fetchData() {
    const response = await fetch('/bksi/projects/data');
    let temp = await response.json();
    return temp.data;
}

function displayData(array) {
    projectsEl.innerHTML = "";
    templateHtml = '';
    projectsArr = [];

    const currentProjectId = drupalSettings.path.currentPath.split("/")[1];
    const arr = array.filter(project => project.nid != currentProjectId);
    //declaring html template for random projects array
    for (projectsData of arr) {
        templateHtml = `
                <div class="group md:relative md:overflow-hidden">
                    <a href="${projectsData['url']}" class="${parseInt(projectsData['tick']) !== 1 ? 'pointer-events-none relative block w-full max-h-[400px] mb-5 md:mb-0' : 'relative block w-full max-h-[400px]  mb-5 md:mb-0'}" class="relative block w-full max-h-[400px] mb-5 md:mb-0">
                        <div class="relative fade-in-image-container h-full active">
                            <picture>
                              <source srcset="${projectsData['image']['large_webp'] ? projectsData['image']['large_webp'] : ''}" media="only screen and (max-width: 450px)" type="image/webp" >
                              <source srcset="${projectsData['image']['large_jpg'] ? projectsData['image']['large_jpg'] : ''}" media="only screen and (max-width: 450px)" type="image/jpeg" >
                              <source srcset="${projectsData['image']['original_webp'] ? projectsData['image']['original_webp'] : ''}" media="only screen and (min-width: 450px)" type="image/webp">
                              <source srcset="${projectsData['image']['original_jpg'] ? projectsData['image']['original_jpg'] : ''}" media="only screen and (min-width: 450px)" type="image/jpeg">
                              <img class="w-full fade-in-image " src="${projectsData['image']['original_jpg'] ? projectsData['image']['original_jpg'] : ''}" alt=""/>
                            </picture>
                            <div  class='absolute w-full md:h-[147px] h-20 bottom-0 left-0 bg-transparent bg-no-repeat bg-clip-padding bg-gradient-to-t from-mainBlack to-[#19142800] group-hover:bg-none'></div>
                        </div>
                        <span class="absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white flex items-center justify-center md:hidden"><img src="../assets/bilder/arrows-navigation/arrow-textlinks.svg" alt=""></span>
                        <h4 class="hidden text-2xl absolute bottom-8 left-10 text-white font-semibold group-hover:bottom-[calc(100%-60px)] group-hover:translate-y-1/2 z-10 md:block">${projectsData['title']}</h4>
                    </a>
                    <div class="opacity-100 flex flex-col gap-[15px] md:absolute md:translate-y-full md:w-full md:h-full md:bg-darkBlue md:opacity-0 md:top-0 md:text-white md:p-10 md:pt-[125px] md:pl-8 md:gap-8 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                        <h4 class="text-[20px]  leading-[24px] tracking-[1px] md:hidden">${projectsData['title']}</h4>

                        <div class="flex items-start gap-4 text-[15px] tracking-[0.75px] leading-[22px] md:gap-10">
                        <div class="flex flex-col w-1/2 gap-[32px]">
                            <div  class="flex flex-col">
                                <p class="!font-['halbfett']">${Drupal.t("Gebäudeart")}</p>
                                <p>${projectsData['building']}</p>
                            </div>
                            <div  class="flex flex-col">
                                <p class="!font-['halbfett']">${Drupal.t("Auftraggeber")}</p>
                                <p> ${projectsData['customer']}</p>
                            </div>
                        </div>
                        <div class="flex flex-col  gap-[32px]">
                            <div class="flex flex-col">
                                <p class="!font-['halbfett']">${Drupal.t("Leistung")}</p>
                                <p>${projectsData['service']}</p>
                            </div>
                            <div class="flex flex-col">
                                <p class="!font-['halbfett']">${Drupal.t("Zeitraum")}</p>
                                <p> ${projectsData['period']}</p>
                            </div>

                        </div>
                    </div>
                        <a href="${projectsData['url']}" class="${parseInt(projectsData['tick']) !== 1 ? 'hidden pointer-events-none' : 'absolute right-5 bottom-5 w-10 h-10 rounded-full bg-white hidden md:flex items-center justify-center'} "><img src="/themes/custom/bksi/images/arrow-textlinks.svg" alt=""></a>
                </div>
            </div>
               `;

        projectsArr.push(templateHtml);
    }

    //get random projects from filtered projects array according to building type of current projects building type
    getRandomProjects(projectsArr, projectsToDisplay, projectsEl);

    document.querySelectorAll('.fade-in-image-container').forEach(fadeInIMageContainer => observer.observe(fadeInIMageContainer), { threshold: [0.2] });
    document.querySelectorAll('.text-fade').forEach(textFade => observer.observe(textFade), { threshold: [0.2] });

}

async function setup() {
    data = await fetchData();
    //filter gotten projects according to current projects building type and display 2 of them randomly
    filteredProjects = similarProjects(data, projectType);
    displayData(filteredProjects);
}
setup();

//function to check if current projects building type is similar to projects from endpoint
function similarProjects(data, projectType) {
    let filterdArr = [...data];
    filterdArr = filterdArr.filter(elem => {
        if (elem['building']) {
            if (elem['building'].toLowerCase().trim()) {
                return elem['building'].toLowerCase() === projectType;
            }
        }
    });
    return filterdArr;
}
//function for get 2 random projects from data
function getRandomProjects(arr, numprojects, output) {
    if(arr[0]){
      for (let j = 0; j < numprojects; j++) {
        let randNum = Math.floor(Math.random() * arr.length);
        arr[randNum] ? output.innerHTML += arr[randNum] : "";
        arr.splice(randNum, 1)
      }
    }else {
      document.getElementById("random-projects_container").classList.add("hidden")
    }

}
