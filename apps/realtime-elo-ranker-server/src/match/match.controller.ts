import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchResultDTO, PublishMatchDto } from './dto/post-match.dto';

@Controller('api/match')
export class MatchController {
    constructor(private readonly matchService: MatchService) {}

    @Post()
    publish(@Body() matchDTO: PublishMatchDto) : Promise<MatchResultDTO> {
        return new Promise((resolve, reject) => {
            this.matchService.publish(matchDTO, (error, result) => {
                console.log(matchDTO);
                if (error) {
                    if(error instanceof BadRequestException) {
                        reject({"code": 422, "message": error.message});
                    }else{
                        reject(error);
                    }
                } else {
                    if(result === undefined) {
                        reject({"code": 500, "message": "Internal server error"});
                    }
                    else {
                        resolve(result);
                    }
                }
            });
        })

    }
}
