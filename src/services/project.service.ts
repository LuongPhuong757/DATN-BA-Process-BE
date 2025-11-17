import { Injectable, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { Screen } from '../entities/screen.entity';
import { ImageProcessingResult } from '../entities/image-processing-result.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateScreenDto } from '../dto/update-screen.dto';
import { ScreenInfoDto } from '../dto/screen-info.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Screen)
    private screenRepository: Repository<Screen>,
    @InjectRepository(ImageProcessingResult)
    private imageProcessingResultRepository: Repository<ImageProcessingResult>,
  ) {}

  async createProject(createDto: CreateProjectDto): Promise<Project> {
    // Check if project name already exists
    const existingProject = await this.projectRepository.findOne({
      where: { name: createDto.nameProject },
    });

    if (existingProject) {
      throw new ConflictException(`Project with name "${createDto.nameProject}" already exists`);
    }

    // Check for duplicate screen names in the request
    if (createDto.screens && createDto.screens.length > 0) {
      const screenNames = createDto.screens;
      const uniqueScreenNames = new Set(screenNames);
      
      if (screenNames.length !== uniqueScreenNames.size) {
        throw new BadRequestException('Screen names within the same project must be unique');
      }
    }

    // Create project
    const project = this.projectRepository.create({
      name: createDto.nameProject,
    });

    const savedProject = await this.projectRepository.save(project);

    // Create screens from array
    if (createDto.screens && createDto.screens.length > 0) {
      // Check if any screen name already exists in this project
      for (const screenName of createDto.screens) {
        const existingScreen = await this.screenRepository.findOne({
          where: { name: screenName, projectId: savedProject.id },
        });

        if (existingScreen) {
          throw new ConflictException(`Screen with name "${screenName}" already exists in this project`);
        }
      }

      const screens = createDto.screens.map(screenName =>
        this.screenRepository.create({
          name: screenName,
          projectId: savedProject.id,
        })
      );

      await this.screenRepository.save(screens);
    }

    // Return project with screens
    return this.projectRepository.findOne({
      where: { id: savedProject.id },
      relations: ['screens'],
    });
  }

  async getAllScreensInfo(projectId?: number): Promise<ScreenInfoDto[]> {
    const whereCondition = projectId ? { projectId } : {};
    
    const screens = await this.screenRepository.find({
      where: whereCondition,
      relations: ['project'],
    });

    const screensInfo: ScreenInfoDto[] = await Promise.all(
      screens.map(async (screen) => {
        const imageProcessingCount = await this.imageProcessingResultRepository.count({
          where: { screenId: screen.id },
        });

        return {
          screenId: screen.id,
          screenName: screen.name,
          projectName: screen.project.name,
          imageProcessingCount,
        };
      })
    );

    return screensInfo;
  }

  async getAllProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['screens'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateScreen(id: number, updateDto: UpdateScreenDto): Promise<Screen> {
    // Find the screen
    const screen = await this.screenRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!screen) {
      throw new NotFoundException(`Screen with id ${id} not found`);
    }

    // Check if the new screen name already exists in the same project
    const existingScreen = await this.screenRepository.findOne({
      where: { name: updateDto.screenName, projectId: screen.projectId },
    });

    if (existingScreen && existingScreen.id !== id) {
      throw new ConflictException(`Screen with name "${updateDto.screenName}" already exists in this project`);
    }

    // Update screen name
    screen.name = updateDto.screenName;
    return await this.screenRepository.save(screen);
  }

  async deleteScreen(id: number): Promise<void> {
    const screen = await this.screenRepository.findOne({
      where: { id },
    });

    if (!screen) {
      throw new NotFoundException(`Screen with id ${id} not found`);
    }

    await this.screenRepository.remove(screen);
  }
}

