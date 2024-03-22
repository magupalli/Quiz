USE [QuizDB]

CREATE TYPE [dbo].[ImageFileTableType] as TABLE(
    [Id] [int] NOT NULL,
    [FileName] [nvarchar](500)  NULL,
    [Contents] [varbinary](max)  NULL,
    [Size] [int]  NULL,
    [QuestionId] [int] NOT NULL,
    [FileIdx] [int] NOT NULL
)
GO

CREATE TYPE [dbo].[QuestionsTableType] as TABLE(
    [Id] [int] NOT NULL,
    [QuizId] [int] NOT NULL,
    [Question] [nvarchar](max)  NULL,
    [Question_En] [nvarchar](max)  NULL,
    [DataType] [int]  NULL,
    [Specs] [nvarchar](max)  NULL,
    [ValidationSpecs] [nvarchar](max)  NULL,
    [Answer] [nvarchar](max)  NULL,
    [Order] [int]  NULL
)
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[usp_GetDepartmentId](@absolutePath nvarchar(500))
RETURNS int 
as
Begin
    Declare @DeptId int = -1;
    Declare @DeptPath nvarchar(500);

    set @DeptPath = left(@absolutePath, (len(@absolutePath) - charindex('/',reverse(@absolutePath)) + 1))

    SELECT
        @DeptId = [Id]
    FROM
        [dbo].[Departments]
    WHERE
        [URL] = @DeptPath
        
    RETURN @DeptId

END;
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE TABLE [dbo].[Admins] (   
    
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [LoginName] [nvarchar](200)  NULL,
    [IsActive] [bit]  NULL,
    [DeptId] [int]  NULL,
    [DisplayName] [nvarchar](500)  NULL,
    [Email] [nvarchar](200)  NULL,
    [CreatedDate] [datetime]  NULL,
    [CreatedBy] [nvarchar] (200) NULL,
    [ModifiedDate] [datetime]  NULL,
    [ModifiedBy] [nvarchar](200)  NULL
) ON [PRIMARY]
GO


SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE TABLE [dbo].[DataTypes] (
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Title] [nvarchar](100)  NULL
) ON [PRIMARY]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Departments] (
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Title] [nvarchar](200)  NULL,
    [URL] [nvarchar](500)  NULL
) ON [PRIMARY]
GO


CREATE TABLE [dbo].[QuizQuestionImages] (
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [FileName] [nvarchar](500)  NULL,
    [Contents] [varbinary](max)  NULL,
    [Size] [int]  NULL,
    [QuizId] [int] NULL,
    [QuestionId] [int] NOT NULL,
    [FileIdx] [int] NULL,
    [UploadedBy] [nvarchar] (200) NULL,
    [UploadedDate] [datetime]  NULL,
    [IsDeleted] [bit]  NULL
) ON [PRIMARY] TEXT_IMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[QuizQuestions] (
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [QuizId] [int] NOT NULL,
    [Question] [nvarchar](max)  NULL,
    [DataType] [int] NOT NULL,
    [Specs] [nvarchar](max)  NULL,
    [Order] [int] NOT NULL,
    [ParentBranchID] [int]  NULL,
    [ParentBranchValueID] [int]  NULL,
    [ValidationSpecs] [nvarchar](max)  NULL,
    [Question_En] [nvarchar](max)  NULL,
    [Answer] [nvarchar](max)  NULL,
) ON [PRIMARY] TEXT_IMAGE_ON [PRIMARY]
GO


CREATE TABLE [dbo].[QuizResponses] (
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [QuizId] [int] NULL,
    [Username] [nvarchar](500) NULL,
    [Response] [nvarchar](max) NULL,
    [Created] [datetime] NULL,
    [Modified] [datetime] NULL,
    [Language] [tinyint] NULL,
    [Status] [tinyint] NULL,
    [DepartmentID] [int] NULL

) ON [PRIMARY] TEXT_IMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[Quizzes] (
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Title] [nvarchar](200) NULL,
    [Description] [nvarchar](max) NULL,
    [PassScore] [int] NULL,
    [MessageId] [int] NULL,
    [HasWelcomeMessage] [bit]  NULL,
    [HasThankyouMessage] [bit]  NULL,
    [RandomOrderQuestions] [bit]  NULL,
    [IsActive] [bit]  NULL,
    [Language] [tinyint] NULL,
    [ReqDirectorateID] [int] NULL,
    [ClassificationID] [int] NULL,
    [DepartmentID] [int] NULL,
    [Title_En] [nvarchar](200) NULL,
    [Description_En] [nvarchar](max) NULL,
    [Status] [tinyint] NULL,
    [CreatedDate] [datetime]  NULL
    [CreatedBy] [nvarchar] (200) NULL,
    [ModifiedDate] [datetime]  NULL,
    [ModifiedBy] [nvarchar](200)  NULL,
    [ClosedDate] [datetime]  NULL,
    [ClosedBy] [nvarchar] (200) NULL,
    [ReOpenedDate] [datetime]  NULL,
    [ReOpenedBy] [nvarchar](200)  NULL,
    [AllowViewResponse] [bit]  NULL,
    [AllowViewAnswers] [bit]  NULL

) ON [PRIMARY] TEXT_IMAGE_ON [PRIMARY]
GO

CREATE TABLE [dbo].[SeniorAdmins] (      
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [LoginName] [nvarchar](200)  NULL,
    [IsActive] [bit]  NULL,
    [DisplayName] [nvarchar](500)  NULL,
    [Email] [nvarchar](200)  NULL,
    [CreatedDate] [datetime]  NULL,
    [CreatedBy] [nvarchar] (200) NULL,
    [ModifiedDate] [datetime]  NULL,
    [ModifiedBy] [nvarchar](200)  NULL
) ON [PRIMARY]
GO


CREATE TABLE [dbo].[SuperAdmins] (      
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [LoginName] [nvarchar](200)  NULL,
    [IsActive] [bit]  NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[QuizQuestions] ADD DEFAULT ((0)) FOR [ParentBranchID]
GO
ALTER TABLE [dbo].[QuizQuestions] ADD DEFAULT ((0)) FOR [ParentBranchValueID]
GO
ALTER TABLE [dbo].[Quizzes] ADD DEFAULT ((1)) FOR [PassScore]
GO
ALTER TABLE [dbo].[Quizzes] ADD DEFAULT ((1)) FOR [MessageId]
GO
ALTER TABLE [dbo].[Quizzes] ADD DEFAULT ((0)) FOR [HasWelcomeMessage]
GO
ALTER TABLE [dbo].[Quizzes] ADD DEFAULT ((0)) FOR [HasThankyouMessage]
GO
ALTER TABLE [dbo].[Quizzes] ADD DEFAULT ((0)) FOR [RandomOrderQuestions]
GO
ALTER TABLE [dbo].[Quizzes] ADD DEFAULT ((0)) FOR [Status]
GO
ALTER TABLE [dbo].[Quizzes] ADD DEFAULT ((0)) FOR [AllowViewResponse]
GO
ALTER TABLE [dbo].[Quizzes] ADD DEFAULT ((0)) FOR [AllowViewAnswers]
GO

CREATE PROCEDURE [dbo].[usp_ChangeAdminStatus]
    @adminId int,
    @modifiedBy nvarchar(200),
    @status bit
AS
    IF Exists ( SELECT Id FROM [dbo].[SuperAdmins]
                WHERE upper([LoginName]) = upper(@modifiedBy) AND [IsActive] = 1)
        BEGIN

            IF Exists ( SELECT Id FROM [dbo].[Admins]
                         WHERE [Id] = @adminId)
                BEGIN       
                    UPDATE 
                        [dbo].[Admins]
                    SET
                        [IsActive] = @status,
                        [ModifiedBy] = @modifiedBy,
                        [ModifiedDate] = getdate()
                    WHERE
                        [Id] = @adminId
                END
            ELSE
                THROW 50003, 'Invalid Record',1
        END
    ELSE
        THROW 50001, 'Access denied', 1;
RETURN 0
GO


CREATE PROCEDURE [dbo].[usp_CloseQuiz]
    @QuizId int,
    @username nvarchar(50),
    @absolutePath nvarchar(500)

AS  
    Declare @QuizIDtable TABLE(ID INT)
    Declare @QuizIDValue INT

    Declare @deptId int;
    set @deptId = [dbo].[usp_GetDepartmentId](@absolutePath)

    IF Exists(SELECT Id FROM [dbo].[Admins] 
                WHERE upper([LoginName]) = upper(@username) AND
                      [DeptId] = @deptId  AND 
                      [IsActive] = 1)
        BEGIN 

            IF Exists(SELECT Id FROM [dbo].[Quizzes] 
                        WHERE [Id] = @QuizId AND [Status] = 1)
                BEGIN
                    UPDATE
                        [dbo].[Quizzes]
                    SET
                        [ModifiedDate] = getdate(),
                        [ModifiedBy] = @username,
                        [Status] = 2
                    WHERE
                        [Id] = @QuizId
                END
            ELSE
                THROW 50005, 'Invalid Quiz selected', 1; 
        END
    ELSE
        THROW 50001, 'Access Denied',1;

RETURN 0
GO



CREATE PROCEDURE [dbo].[usp_CreateAdmin]
    @username nvarchar(200),
    @email nvarchar(200),
    @displayname nvarchar(500),
    @deptId int,
    @createdBy nvarchar(200)

AS  

    IF Exists(SELECT Id FROM [dbo].[SuperAdmins] 
                WHERE upper([LoginName]) = upper(@createdBy) AND
                      [IsActive] = 1)
        BEGIN             
            IF NOT Exists(SELECT Id FROM [dbo].[Admins] 
                        WHERE upper([LoginName]) = upper(@username) AND
                            [DeptId] = @deptId)
                BEGIN
                    INSERT INTO
                        [dbo].[Admins]
                        (
                            [LoginName],
                            [DeptId],
                            [DisplayName],
                            [Email],
                            [IsActive],
                            [CreatedBy],
                            [CreatedDate],
                            [ModifiedBy],
                            [ModifiedDate]
                        )
                    VALUES
                        (
                            @username,
                            @deptId,
                            @displayname,
                            @email,
                            1,
                            @createdBy,
                            getdate(),
                            @createdBy,
                            getdate()
                        )
                    
                END
            ELSE
                THROW 50002, 'Duplicate Record', 1; 
        END
    ELSE
        THROW 50001, 'Access Denied',1;

RETURN 0
GO




CREATE PROCEDURE [dbo].[usp_CreateQuiz]
    @QuizId int,
    @Title nvarchar(200),
    @Title_En nvarchar(200),
    @Description nvarchar(MAX),
    @Description_En nvarchar(MAX),
    @RequestingDirectorate int,
    @Classification int,
    @PassScore int,
    @AllowViewResponse bit,
    @AllowViewAnswers bit,
    @MessageId int,
    @HasWelcomeMessage bit,
    @HasThankyouMessage bit,
    @RandomOrderQuestions bit,
    @Questions_Table QuestionsTableType READONLY,
    @username nvarchar(50),
    @language tinyint,
    @IsActive bit,
    @QuizStatus tinyint,
    @absolutePath nvarchar(500)

AS  
    Declare @QuizIDtable TABLE(ID INT)
    Declare @QuizIDValue INT

    Declare @deptId int;
    set @deptId = [dbo].[usp_GetDepartmentId](@absolutePath)

    IF Exists(SELECT Id FROM [dbo].[Admins] 
                WHERE upper([LoginName]) = upper(@username) AND
                      [DeptId] = @deptId  AND 
                      [IsActive] = 1)
        BEGIN 

            IF @QuizId = 0
                BEGIN
                    INSERT INTO
                        [dbo].[Quizzes]
                        (
                            [Title],
                            [Title_En],
                            [Desription],
                            [Desription_En],
                            [ReqDirectorateID],
                            [ClassificationID],
                            [PassScore],
                            [AllowViewResponse],
                            [AllowViewAnswers],
                            [MessageId],
                            [HasWelcomeMessage],
                            [HasThankyouMessage],
                            [RandomOrderQuestions],
                            [Language],
                            [DepartmentId]
                            [CreatedDate],
                            [CreatedBy],
                            [ModifiedDate],
                            [ModifiedBy],
                            [Status],
                            [IsActive]
                        )
                    OUTPUT Inserted.ID INTO @QuizIDtable
                    VALUES
                        (
                            @Title,
                            @Title_En,
                            @Description,
                            @Description_En,
                            @RequestingDirectorate,
                            @Classification,
                            @PassScore,
                            @AllowViewResponse,
                            @AllowViewAnswers,
                            @MessageId,
                            @HasWelcomeMessage,
                            @HasThankyouMessage,
                            @RandomOrderQuestions,
                            @language,
                            @deptId,
                            getdate(),
                            @username,
                            getdate()
                            @username,
                            @QuizStatus,
                            @IsActive
                        )

                    set @QuizIDValue = (select ID from @QuizIDtable)

                    INSERT INTO
                        [dbo].[QuizQuestions]
                        (
                            [QuizId],
                            [Question],
                            [DataType],
                            [Specs],
                            [Order],                           
                            [ValidationSpecs],
                            [Answer],
                            [Question_En]
                        )
                    SELECT
                        @QuizIDValue,
                        [Question],
                        [DataType],
                        [Specs],
                        [Order],
                        [ValidationSpecs],
                        [Answer],
                        [Question_En]
                    FROM    
                        @Questions_Table
                END
            ELSE
                BEGIN
                    UPDATE
                        [dbo].[Quizzes]
                    SET
                        [Title] = @Title,
                        [Title_En] = @Title_En,
                        [Description] = @Description,
                        [Description_En] = @Description_En,
                        [ReqDirectorateID] = @RequestingDirectorate,
                        [ClassificationID] = @Classification
                        [PassScore] = @PassScore,
                        [AllowViewResponse] = @AllowViewResponse,
                        [AllowViewAnswers] = @AllowViewAnswers,
                        [MessageId] = @MessageId,
                        [HasWelcomeMessage] = @HasWelcomeMessage,
                        [HasThankyouMessage] = @HasThankyouMessage,
                        [RandomOrderQuestions] = @RandomOrderQuestions,
                        [Language] = @language,
                        [DepartmentId] = @deptId,
                        [ModifiedDate] = getdate(),
                        [ModifiedBy] = @username,
                        [Status] = @QuizStatus,
                        [IsActive] = @IsActive
                    WHERE
                        [Id] = @QuizId


                    MERGE
                        [dbo].[QuizQuestions] a
                    USING
                        ( 
                            SELECT
                                Id,
                                @QuizId as QuizId,
                                [Question],
                                [DataType],
                                [Specs],
                                [Order],
                                [ValidationSpecs],
                                [Answer],
                                [Question_En]
                            FROM
                                @Questions_Table
                        ) b
                    ON
                        a.[Id] = b.[Id]
                    WHEN MATCHED
                        THEN UPDATE SET
                            a.[Question]  = b.[Question],
                            a.[DataType] = b.[DataType],
                            a.[Specs] = b.[Specs],
                            a.[Order] = b.[Order],
                            a.[ValidationSpecs] = b.[ValidationSpecs],
                            a.[Answer] = b.[Answer]
                            a.[Question_En] = b.[Question_En]

                    WHEN NOT MATCHED BY TARGET
                        THEN INSERT
                            (
                                [QuizId],
                                [Question],
                                [DataType],
                                [Specs],
                                [Order],
                                [ValidationSpecs],
                                [Answer],
                                [Question_En]
                            )
                            Values 
                            (
                                @QuizId,
                                b.[Question],
                                b.[DataType],
                                b.[Specs],
                                b.[Order],
                                b.[ValidationSpecs],
                                b.[Answer],
                                b.[Question_En]
                            )
                    WHEN NOT MATCHED BY SOURCE AND a.[QuizId] = @QuizId
                        THEN DELETE;

                END 
        END
    ELSE
        THROW 50001, 'Access Denied',1;

RETURN 0
GO


CREATE PROCEDURE [dbo].[usp_DeleteQuiz]
    @QuizId int,
    @username nvarchar(50),
    @absolutePath nvarchar(500)

AS      

    Declare @deptId int;
    set @deptId = [dbo].[usp_GetDepartmentId](@absolutePath)

    IF Exists(SELECT Id FROM [dbo].[Admins] 
                WHERE upper([LoginName]) = upper(@username) AND
                      [DeptId] = @deptId  AND 
                      [IsActive] = 1)
        BEGIN 

            IF @QuizId <> 0
                BEGIN

                    IF Exists (SELECT Id FROM [dbo].[Quizzes]
                                WHERE 
                                    [Id] = @QuizId AND
                                    [DepartmentID] = @deptId AND
                                    [Status] = 0)
                        BEGIN

                            DELETE FROM [dbo].[QuizQuestionImages]
                                WHERE [QuizId] = @QuizId
                            DELETE FROM [dbo].[QuizQuestions]
                                WHERE [QuizId] = @QuizId
                            DELETE FROM [dbo].[Quizzes]
                                WHERE [Id] = @QuizId AND [DepartmentID] = @deptId
                        END
                    ELSE
                        THROW 50005, 'No Quiz Found',1;                    
                END
            ELSE
                THROW 50005, 'Invalid Quiz selected', 1; 
        END
    ELSE
        THROW 50001, 'Access Denied',1;

RETURN 0
GO

CREATE PROCEDURE [dbo].[usp_GetActiveQuiz]
    @QuizId int,
    @absolutePath nvarchar(500),
    @username nvarchar(50)

AS    

    Begin

        Declare @deptId int;
        set @deptId = [dbo].[usp_GetDepartmentId](@absolutePath)

        SELECT
            a.[Id],
            a.[Title],
            a.[Description],
            a.[Title_En],
            a.[Description_En],
            a.[Language],
            a.[DepartmentId],
            a.[ClassificationID],
            a.[PassScore],
            a.[AllowViewResponse],
            a.[AllowViewAnswers],
            a.[MessageId],
            a.[HasWelcomeMessage],
            a.[HasThankyouMessage],
            a.[RandomOrderQuestions]           

        FROM 
            [dbo].[Quizzes] a
        WHERE
            a.[Id] = @QuizId
            AND a.[Status] = 1
            AND a.[DepartmentId] = @deptId

        --FETCH Quiz Questions
        SELECT
            b.[Id],
            b.[QuizId],
            b.[Question],
            b.[Question_En],
            b.[DataType],
            b.[Specs],
            b.[ValidationSpecs],
            b.[Answer],
            b.[Order]

        FROM 
            [dbo].[Quizzes] a
            join [dbo].[QuizQuestions] b on b.[QuizId] = a.[Id]
        WHERE
            a.[Id] = @QuizId
            AND a.[Status] = 1
            AND a.[DepartmentId] = @deptId
        ORDER BY    
            b.[Order]


        --FETCH Quiz Question Images
        SELECT
            b.[Id],
            b.[FileName],
            b.[Contents],
            b.[Size],
            b.[QuizId],
            b.[QuestionId],
            b.[FileIdx]

        FROM 
            [dbo].[Quizzes] a
            join [dbo].[QuizQuestionImages] b on b.[QuizId] = a.[Id]
        WHERE
            a.[Id] = @QuizId
            AND a.[Status] = 1
            AND a.[DepartmentId] = @deptId
        ORDER BY    
            b.[FileName]

        --FETCH User Responses
        SELECT
            top 1 Id
        FROM 
            [dbo].[QuizResponses]
        WHERE
            [QuizId] = @QuizId AND [Username] = @username
    End
RETURN 0
GO


CREATE PROCEDURE [dbo].[usp_GetActiveQuizPreview]
    @QuizId int,
    @absolutePath nvarchar(500)

AS    

    Begin

        Declare @deptId int;
        set @deptId = [dbo].[usp_GetDepartmentId](@absolutePath)

        SELECT
            a.[Id],
            a.[Title],
            a.[Description],
            a.[Title_En],
            a.[Description_En],
            a.[Language],
            a.[DepartmentId],
            a.[ClassificationID],
            a.[PassScore],
            a.[AllowViewResponse],
            a.[AllowViewAnswers],
            a.[MessageId],
            a.[HasWelcomeMessage],
            a.[HasThankyouMessage],
            a.[RandomOrderQuestions],
            a.[Status]          

        FROM 
            [dbo].[Quizzes] a
        WHERE
            a.[Id] = @QuizId
            --AND a.[Status] = 1
            AND a.[DepartmentId] = @deptId

        --FETCH Quiz Questions
        SELECT
            b.[Id],
            b.[QuizId],
            b.[Question],
            b.[Question_En],
            b.[DataType],
            b.[Specs],
            b.[ValidationSpecs],
            b.[Answer],
            b.[Order]

        FROM 
            [dbo].[Quizzes] a
            join [dbo].[QuizQuestions] b on b.[QuizId] = a.[Id]
        WHERE
            a.[Id] = @QuizId
            --AND a.[Status] = 1
            AND a.[DepartmentId] = @deptId
        ORDER BY    
            b.[Order]


        --FETCH Quiz Question Images
        SELECT
            b.[Id],
            b.[FileName],
            b.[Contents],
            b.[Size],
            b.[QuizId],
            b.[QuestionId],
            b.[FileIdx]

        FROM 
            [dbo].[Quizzes] a
            join [dbo].[QuizQuestionImages] b on b.[QuizId] = a.[Id]
        WHERE
            a.[Id] = @QuizId
            --AND a.[Status] = 1
            AND a.[DepartmentId] = @deptId
        ORDER BY    
            b.[FileName]
        
    End
RETURN 0
GO


CREATE PROCEDURE [dbo].[usp_GetAdmin]
    @adminId int,
    @username nvarchar(200)

AS    

    IF Exists( SELECT Id FROM [dbo].[SuperAdmins]
                WHERE upper([LoginName]) = upper(@username) AND
                        [IsActive] = 1)
        BEGIN
            SELECT
                a.[Id],
                a.[LoginName],
                a.[IsActive],
                a.[DeptId],
                b.[Title] 'DeptText',
                a.[DisplayName],
                a.[Email]     

            FROM 
                [dbo].[Admins] a
                join [dbo].[Departments] b on b.[Id] = a.[DeptId]
            WHERE
                a.[Id] = @adminId            
        END
    ELSE
        THROW 50001,'Access Denied', 1;
RETURN 0
GO


CREATE PROCEDURE [dbo].[usp_GetAdmins]    
    @username nvarchar(200)
AS    
    IF Exists( SELECT Id FROM [dbo].[SuperAdmins]
                WHERE upper([LoginName]) = upper(@username) AND
                        [IsActive] = 1)
        BEGIN
            SELECT
                a.[Id],
                a.[LoginName],
                a.[IsActive],
                a.[DeptId],
                b.[Title] 'DeptText',
                a.[DisplayName],
                a.[Email]     

            FROM 
                [dbo].[Admins] a
                join [dbo].[Departments] b on b.[Id] = a.[DeptId]
            ORDER BY
                [ModifiedDate] desc                       
        End
    ELSE
        THROW 50001,'Access Denied', 1;
RETURN 0
GO

CREATE PROCEDURE [dbo].[usp_GetQuiz]
    @QuizId int,
    @absolutePath nvarchar(500),
    @username nvarchar(500),
    @edit bit

AS  
    Declare @deptId int;
    set @deptId = [dbo].[usp_GetDepartmentId](@absolutePath)

    IF Exists( SELECT Id FROM [dbo].[Admins] 
                WHERE upper([LoginName]) = upper(@username) AND     
                        [DeptId] = @deptId AND
                        [IsActive] = 1)
        BEGIN

            SELECT
                a.[Id],
                a.[Title],
                a.[Description],
                a.[Title_En],
                a.[Description_En],
                a.[ReqDirectorateID],
                a.[ClassificationID],
                a.[PassScore],
                a.[AllowViewResponse],
                a.[AllowViewResponse],
                a.[Language],
                a.[MessageId],
                a.[HasWelcomeMessage],
                a.[HasThankyouMessage],
                a.[RandomOrderQuestions]           

            FROM 
                [dbo].[Quizzes] a
            WHERE
                a.[Id] = @QuizId
                AND ((a.[Status] = 0 and @edit = 1) or (a.[Status] = 1 and @edit = 0))
                AND a.[DepartmentId] = @deptId

            --FETCH Quiz Questions
            SELECT
                b.[Id],
                b.[QuizId],
                b.[Question],
                b.[Question_En],
                b.[DataType],
                b.[Specs],
                b.[ValidationSpecs],
                b.[Answer],
                (select count([Id])) from [dbo].[QuizQuestionImages] qi where qi.[QuestionId] = b.[Id]) ImagesCount,
                b.[Order]

            FROM 
                [dbo].[Quizzes] a
                join [dbo].[QuizQuestions] b on b.[QuizId] = a.[Id]
            WHERE
                b.[QuizId] = @QuizId
                AND ((a.[Status] = 0 and @edit = 1) or (a.[Status] = 1 and @edit = 0))
                AND a.[DepartmentId] = @deptId
            ORDER BY    
                b.[Order]

        END
    ELSE    
        THROW 50001, 'Access Denied', 1;

RETURN 0
GO




CREATE PROCEDURE [dbo].[usp_GetQuizResponse] 
    @QuizId int,
    @responseId int,
    @edit bit,    
    @username nvarchar(200),
    @absolutePath nvarchar(500)

AS    

    Declare @deptId int;
    set @deptId = [dbo].[usp_GetDepartmentId](@absolutePath)
  

    --FETCH Quiz
    SELECT
        a.[Id],
        a.[Title],
        a.[Description],
        a.[Title_En],
        a.[Description_En],
        a.[Language],
        a.[AllowViewResponse],
        a.[AllowViewAnswers],
        a.[PassScore]       

    FROM 
        [dbo].[Quizzes] a
    WHERE
        a.[Id] = @QuizId AND
        (@edit = 0 OR a.[Status] = 1) AND
        a.[DepartmentId] = @deptId

    --FETCH Quiz Questions
    SELECT
        b.[Id],
        b.[QuizId],
        b.[Question],
        b.[Question_En],
        b.[DataType],
        b.[Specs],
        b.[ValidationSpecs],
        b.[Answer],
        b.[Order]

    FROM 
        [dbo].[Quizzes] a
        join [dbo].[QuizQuestions] b on b.[QuizId] = a.[Id]
    WHERE
        b.[QuizId] = @QuizId AND
        (@edit = 0 OR a.[Status] = 1) AND
        a.[DepartmentId] = @deptId
    ORDER BY    
        b.[Order]

    
    --FETCH Quiz Question Images
    SELECT
        b.[Id],
        b.[FileName],
        b.[Contents],
        b.[Size],
        b.[QuizId],
        b.[QuestionId],
        b.[FileIdx]

    FROM 
        [dbo].[Quizzes] a
        join [dbo].[QuizQuestionImages] b on b.[QuizId] = a.[Id]
    WHERE
        b.[QuizId] = @QuizId  AND --a.[Id] = @QuizId AND
        (@edit = 0 OR a.[Status] = 1) AND
        a.[DepartmentId] = @deptId
    ORDER BY    
        b.[FileIdx]


    --Fetch Response to edit/view
    SELECT
        c.[Id],
        c.[QuizId],
        c.[Username],
        c.[Response],
        c.[Language]

    FROM 
        [dbo].[Quizzes] a
        join [dbo].[QuizResponses] c on c.[QuizId] = a.[Id]
    WHERE
        c.[QuizId] = @QuizId AND
        c.[Id] = @responseId AND
        upper(c.[Username]) = upper(@username) AND
        (@edit = 0 OR c.[Status]=0) AND
        a.[DepartmentId] = @deptId    

    
        
RETURN 0
GO



CREATE PROCEDURE [dbo].[usp_GetQuizResponseOnly] 
    @quizId int,
    @username nvarchar(500),
    @absolutePath nvarchar(500)

AS    

    Declare @deptId int;
    set @deptId = [dbo].[usp_GetDepartmentId](@absolutePath)
  
    
    --Fetch Response 
    SELECT
        c.[Id],
        c.[QuizId],
        c.[Username],
        c.[Response],
        c.[Language]

    FROM 
        [dbo].[Quizzes] a
        join [dbo].[QuizResponses] c on c.[QuizId] = a.[Id]
    WHERE
        c.[QuizId] = @quizId AND
        upper(c.[Username]) = upper(@username) AND
        c.[Status]=1 AND
        a.[DepartmentId] = @deptId    

        
RETURN 0
GO



CREATE PROCEDURE [dbo].[usp_GetQuizResponses] 
    @QuizId int,
    @absolutePath nvarchar(500),
    @username nvarchar(500)

AS    

    Declare @deptId int;
    set @deptId = [dbo].[usp_GetDepartmentId](@absolutePath)
  
    IF Exists( SELECT Id FROM [dbo].[Admins] 
                WHERE upper([LoginName]) = upper(@username) AND     
                        [DeptId] = @deptId AND
                        [IsActive] = 1)
        BEGIN

            --FETCH Quiz
            SELECT
                a.[Id],
                a.[Title],
                a.[Description],
                a.[Title_En],
                a.[Description_En],
                a.[Language],
                a.[PassScore]         

            FROM 
                [dbo].[Quizzes] a
            WHERE
                a.[Id] = @QuizId AND
                a.[DepartmentId] = @deptId AND
                a.[Status] <> 0

            --FETCH Quiz Questions
            SELECT
                b.[Id],
                b.[QuizId],
                b.[Question],
                b.[Question_En],
                b.[DataType],
                b.[Specs],
                b.[ValidationSpecs],
                b.[Order],
                b.[Answer]

            FROM 
                [dbo].[Quizzes] a
                join [dbo].[QuizQuestions] b on b.[QuizId] = a.[Id]
            WHERE
                b.[QuizId] = @QuizId AND
                a.[DepartmentId] = @deptId AND
                a.[Status] <> 0
            ORDER BY    
                b.[Order]

    
            --FETCH Quiz Question Images
            SELECT
                b.[Id],
                b.[FileName],
                b.[Contents],
                b.[Size],
                b.[QuizId],
                b.[QuestionId],
                b.[FileIdx]

            FROM 
                [dbo].[Quizzes] a
                join [dbo].[QuizQuestionImages] b on b.[QuizId] = a.[Id]
            WHERE
                b.[QuizId] = @QuizId  AND --a.[Id] = @QuizId AND
                a.[DepartmentId] = @deptId AND
                a.[Status] <> 0
            ORDER BY    
                b.[FileIdx]


            --Fetch Quiz Responses 
            SELECT
                c.[Id],
                c.[QuizId],
                c.[Username],
                c.[Response],
                c.[Modified]

            FROM 
                [dbo].[Quizzes] a
                join [dbo].[QuizResponses] c on c.[QuizId] = a.[Id]
            WHERE
                c.[QuizId] = @QuizId AND
                c.[Status] = 1 AND
                a.[DepartmentId] = @deptId AND
                a.[Status] <> 0

        END
    ELSE    
        THROW 50001, 'Access Denied', 1;        

        
RETURN 0
GO



CREATE PROCEDURE [dbo].[usp_GetQuizs]
    @absolutePath nvarchar(500),
    @username nvarchar(500)

AS  
    Declare @deptId int;
    set @deptId = [dbo].[usp_GetDepartmentId](@absolutePath)

    IF Exists( SELECT Id FROM [dbo].[Admins] 
                WHERE upper([LoginName]) = upper(@username) AND     
                        [DeptId] = @deptId AND
                        [IsActive] = 1)
        BEGIN

            SELECT
                a.[Id],
                a.[Title],
                a.[Description],
                a.[Title_En],
                a.[Description_En],
                a.[Language],
                a.[Status],
                a.[IsActive],                
                a.[ReqDirectorateID],
                a.[ClassificationID],
                (SELECT TOP 1 [DisplayName] 
                    FROM [dbo].[Admins] 
                    WHERE [dbo].[Admins].[LoginName] = a.[ModifiedBy]
                    ORDER BY [dbo].[Admins].[ModifiedDate] ) 'ModifiedBy',
                a.[ModifiedDate]          

            FROM 
                [dbo].[Quizzes] a
            WHERE
                a.[DepartmentId] = @deptId
            ORDER BY 
                a.[Id] desc

        END
    ELSE    
        THROW 50001, 'Access Denied', 1;

RETURN 0
GO


CREATE PROCEDURE [dbo].[usp_PublishQuiz]
    @QuizId int,
    @username nvarchar(50),
    @absolutePath nvarchar(500)

AS  
    Declare @QuizIDtable TABLE(ID INT)
    Declare @QuizIDValue INT

    Declare @deptId int;
    set @deptId = [dbo].[usp_GetDepartmentId](@absolutePath)

    IF Exists(SELECT Id FROM [dbo].[Admins] 
                WHERE upper([LoginName]) = upper(@username) AND
                      [DeptId] = @deptId  AND 
                      [IsActive] = 1)
        BEGIN 

            IF Exists(SELECT Id FROM [dbo].[Quizzes] 
                        WHERE [Id] = @QuizId AND [Status] = 0)
                BEGIN
                    UPDATE
                        [dbo].[Quizzes]
                    SET
                        [ModifiedDate] = getdate(),
                        [ModifiedBy] = @username,
                        [Status] = 1
                    WHERE
                        [Id] = @QuizId
                END
            ELSE
                THROW 50005, 'Invalid Quiz selected', 1; 
        END
    ELSE
        THROW 50001, 'Access Denied',1;

RETURN 0
GO



CREATE PROCEDURE [dbo].[usp_ReOpenQuiz]
    @quizId int,
    @username nvarchar(50),
    @absolutePath nvarchar(500)

AS  
    Declare @QuizIDtable TABLE(ID INT)
    Declare @QuizIDValue INT

    Declare @deptId int;
    set @deptId = [dbo].[usp_GetDepartmentId](@absolutePath)

    IF Exists(SELECT Id FROM [dbo].[Admins] 
                WHERE upper([LoginName]) = upper(@username) AND
                      [DeptId] = @deptId  AND 
                      [IsActive] = 1)
        BEGIN 

            IF Exists(SELECT Id FROM [dbo].[Quizzes] 
                        WHERE [Id] = @quizId AND [Status] = 2)
                BEGIN
                    UPDATE
                        [dbo].[Quizzes]
                    SET
                        [ReOpenedDate] = getdate(),
                        [ReOpenedBy] = @username,
                        [Status] = 1
                    WHERE
                        [Id] = @quizId
                END
            ELSE
                THROW 50005, 'Invalid Quiz selected', 1; 
        END
    ELSE
        THROW 50001, 'Access Denied',1;

RETURN 0
GO


CREATE PROCEDURE [dbo].[usp_submitQuizResponse]
    @responseId int,
    @QuizId int,
    @DepartmentID int,
    @language tinyint,
    @userName nvarchar(500),
    @response nvarchar(MAX),
    @responseStatus tinyint

    AS
        Declare @ResponseIDtable TABLE(ID INT)
        Declare @ResponseIDValue  INT

        
        IF @responseId = 0
            BEGIN
                IF Exists( SELECT Id 
                            FROM [dbo].[QuizResponses] 
                            WHERE [QuizId] = @QuizId AND [Username] =  @userName)
                    THROW 50004,'Already Submitted. Multiple responses not allowed', 1;

                ELSE
                    BEGIN
                        INSERT INTO [dbo].[QuizResponses]
                            ([QuizId],
                            [DepartmentId],
                            [Username],
                            [Response],
                            [Language],
                            [Created],
                            [Modified],
                            [Status])
                        OUTPUT INTO Inserted.ID INTO @ResponseIDtable
                        VALUES 
                            (@QuizId,
                            @DepartmentID,
                            @userName,
                            @response,
                            @language,
                            getdate(),
                            getdate(),
                            @responseStatus)

                        
                    END
            END
        ELSE
            BEGIN
                UPDATE
                    [dbo].[QuizResponses]
                SET
                    [Response] = @response,
                    [Language] = @language,
                    [Modified] = getdate(),
                    [Status] = @responseStatus
                WHERE
                    [Id] = @responseId
            END

RETURN 0
GO


CREATE PROCEDURE [dbo].[usp_UpdateQuizImageChoices]
    @QuizId int,
    @ImageChoices_Table ImageFileTableType READONLY,
    @username nvarchar(500),
    @absolutePath nvarchar(500)

AS

    Declare @deptId int;
    Declare @QuizDeptId int;
    set @deptId = [dbo].[usp_GetDepartmentId] (@absolutePath)

    IF Exists(SELECT Id FROM [dbo].[Admins] 
                WHERE upper([LoginName]) = upper(@username) AND
                      [DeptId] = @deptId  AND 
                      [IsActive] = 1)
        BEGIN 

            IF @QuizId <> 0
                BEGIN 
                    SELECT 
                        @QuizDeptId =[DepartmentId]
                    FROM 
                        [dbo].[Quizzes]
                    WHERE
                        [Id] = @QuizId AND
                        [DepartmentId] = @deptId

                    IF @QuizDeptId = @deptId 
                        BEGIN 
                            DELETE FROM [dbo].[QuizQuestionImages] 
                                            WHERE [QuizId] = @QuizId 
                            INSERT INTO [dbo].[QuizQuestionImages] 
                                ([FileName],
                                [Contents],
                                [Size],
                                [QuizId],
                                [QuestionId],
                                [FileIdx],
                                [UploadedBy],
                                [UploadedDate])
                            SELECT 
                                [FileName],
                                [Contents],
                                [Size],
                                @QuizId,
                                [QuestionId],
                                [FileIdx],
                                @userName,
                                getdate()
                            FROM
                                @ImageChoices_Table
                        END
                    ELSE    
                        THROW 50001, 'Access Denied', 1;

                END
        END

   ELSE    
        THROW 50001, 'Access Denied', 1;
RETURN 0
GO