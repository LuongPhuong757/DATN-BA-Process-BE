import { Controller, Post, Get, Put, Delete, Body, Param, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProjectService } from '../services/project.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UpdateScreenDto } from '../dto/update-screen.dto';
import { Project } from '../entities/project.entity';
import { Screen } from '../entities/screen.entity';
import { ScreenInfoDto } from '../dto/screen-info.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({
    status: 200,
    description: 'List of all projects with their screens',
    type: [Project],
    example: [
      {
        id: 1,
        name: 'My Project',
        description: null,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        screens: [
          {
            id: 1,
            name: 'Screen 1',
            description: null,
            projectId: 1,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
          {
            id: 2,
            name: 'Screen 2',
            description: null,
            projectId: 1,
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
          },
        ],
      },
    ],
  })
  async getAllProjects(): Promise<Project[]> {
    return this.projectService.getAllProjects();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new project with screens' })
  @ApiBody({
    type: CreateProjectDto,
    examples: {
      example1: {
        summary: 'Example: Create project with screens',
        value: {
          nameProject: 'My Project',
          screens: ['Screen 1', 'Screen 2', 'Screen 3'],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
    type: Project,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createProject(@Body() createDto: CreateProjectDto): Promise<Project> {
    return this.projectService.createProject(createDto);
  }

  @Get('screens')
  @ApiOperation({ summary: 'Get all screens with project info and image processing count' })
  @ApiResponse({
    status: 200,
    description: 'List of screens with information',
    type: [ScreenInfoDto],
    example: [
      {
        screenId: 1,
        screenName: 'Screen 1',
        projectName: 'My Project',
        imageProcessingCount: 5,
      },
      {
        screenId: 2,
        screenName: 'Screen 2',
        projectName: 'My Project',
        imageProcessingCount: 3,
      },
    ],
  })
  @ApiQuery({
    name: 'projectId',
    required: false,
    type: Number,
    description: 'Filter screens by project ID',
    example: 1,
  })
  async getAllScreensInfo(
    @Query('projectId') projectId?: string,
  ): Promise<ScreenInfoDto[]> {
    const projectIdNumber = projectId ? parseInt(projectId, 10) : undefined;
    if (projectId && isNaN(projectIdNumber)) {
      throw new BadRequestException('projectId must be a valid number');
    }
    return this.projectService.getAllScreensInfo(projectIdNumber);
  }

  @Put('screens/:id')
  @ApiOperation({ summary: 'Update a screen by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Screen ID',
    example: 1,
  })
  @ApiBody({
    type: UpdateScreenDto,
    examples: {
      example1: {
        summary: 'Example: Update screen name',
        value: {
          screenName: 'Updated Screen Name',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Screen updated successfully',
    type: Screen,
  })
  @ApiResponse({ status: 404, description: 'Screen not found' })
  @ApiResponse({ status: 409, description: 'Screen name already exists in this project' })
  async updateScreen(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateScreenDto,
  ): Promise<Screen> {
    return this.projectService.updateScreen(id, updateDto);
  }

  @Delete('screens/:id')
  @ApiOperation({ summary: 'Delete a screen by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Screen ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Screen deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Screen not found' })
  async deleteScreen(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.projectService.deleteScreen(id);
    return { message: 'Screen deleted successfully' };
  }
}

