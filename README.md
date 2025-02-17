# seasonme

A tool to organize your TV show and movie files by:
1. **Formatting** - Standardize naming of video and subtitle files
2. **Moving Subtitles** - Organize subtitle files to match with video files

# <img src="https://github.com/edwardfxiao/seasonme/blob/master/public/index.gif" />

## Installation
```sh
npm install seasonme -g
```

## 1. Format Files (`seasonme format`)
Standardize the naming of your video and subtitle files in a directory.

### Usage
```sh
~$ cd MY_FOLDER_PATH
~$ seasonme format
# or
~$ seasonme format -d MY_FOLDER_PATH
```

### Example
Before:
```
The.Office.US.S01
│
│   The.Office.US.S01e1.bluray.mp4
│   The.Office.US.S01e2.bluray.mp4
│   the office 1x1.srt
│   the office 1x2.srt
```

After:
```
The.Office.US.S01
│
│   The.Office.US.S01E1.BluRay.mp4
│   The.Office.US.S01E1.BluRay.srt
│   The.Office.US.S01E2.BluRay.mp4
│   The.Office.US.S01E2.BluRay.srt
```

## 2. Move Subtitles (`seasonme movesubs`)
Organize subtitle files from a Subs directory to match with your video files. Supports both TV series and movies.

### For TV Series
```sh
~$ seasonme movesubs -t series -d MY_SERIES_PATH(e.g. ~/your/path/to/Twin.Peaks)
```

#### Expected Structure
```
Twin.Peaks
│
└───Twin.Peaks.S01
│   │   Twin.Peaks.S01E01.mp4
│   │   Twin.Peaks.S01E02.mp4
│   │
│   └───Subs
│       └───Twin.Peaks.S01E01
│           │   English3.srt
│           │   English4.srt
│           │   French1.srt
│       └───Twin.Peaks.S01E02
│           │   English3.srt
│           │   English4.srt
│           │   French1.srt
```

#### Resulting folder structure:
```
Twin.Peaks
│
└───Twin.Peaks.S01
│   │   Twin.Peaks.S01E01.mp4
│   │   Twin.Peaks.S01E01.English.3.srt
│   │   Twin.Peaks.S01E01.English.4.srt
│   │   Twin.Peaks.S01E01.French.1.srt
│   │   Twin.Peaks.S01E02.mp4
│   │   Twin.Peaks.S01E02.English.3.srt
│   │   Twin.Peaks.S01E02.English.4.srt
│   │   Twin.Peaks.S01E02.French.1.srt
```

### For Movies
```sh
~$ seasonme movesubs -t movies -d MY_MOVIES_PATH(e.g. ~/your/path/to/movies)
```

#### Expected Structure
```
movies
│
└───Toy.Story.1995
│   │   Toy.Story.1995.mp4
│   │
│   └───Subs
│       │   English3.srt
│       │   English4.srt
│       │   French1.srt
│
└───Mission.Impossible.1996
    │   Mission.Impossible.1996.mp4
    │
    └───Subs
        │   English3.srt
        │   English4.srt
        │   French1.srt
```

#### Resulting folder structure:
```
movies
│
└───Toy.Story.1995
│   │   Toy.Story.1995.mp4
│   │   Toy.Story.1995.English.3.srt
│   │   Toy.Story.1995.English.4.srt
│   │   Toy.Story.1995.French.1.srt
│
└───Mission.Impossible.1996
    │   Mission.Impossible.1996.mp4
    │   Mission.Impossible.1996.English.3.srt
    │   Mission.Impossible.1996.English.4.srt
    │   Mission.Impossible.1996.French.1.srt
```

## Testing (for seasonme format)
Generate sample files to test the functionality:
```sh
~$ mkdir dummy
~$ cd dummy
~$ seasonme generate -n 10  # Creates 10 random example files
```