import { Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { About } from '../../components/about/about';
import { Experience } from '../../components/experience/experience';
import { Education } from '../../components/education/education';
import { Projects } from '../../components/projects/projects';
import { Skills } from '../../components/skills/skills';
import { Blog } from '../../components/blog/blog';
import { Beyond } from '../../components/beyond/beyond';
import { Contact } from '../../components/contact/contact';

@Component({
  selector: 'app-home',
  imports: [Hero, About, Experience, Education, Projects, Skills, Blog, Beyond, Contact],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
