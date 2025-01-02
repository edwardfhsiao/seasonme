# seasonme

A tool to organize your TV show files naming and make sure that the subtitle file matches with the video file in the folder.

For instanse, inside ```The.Office.US.S01``` folder you have ```The.Office.US.S01e1.mkv```, but a ```the office 1x1.srt``` was downloaded, and now you can just
run ```seasonme format```, it will set the files to ```The.Office.US.S01S01.mkv```,```The.Office.US.S01S01.srt``` respectively.

In order to make it work properly, make sure that the ```season``` and ```episode``` info are correctly since the key in this tool is to match the ```season``` number and the ```episode``` number.


# <img src="https://github.com/edwardfxiao/seasonme/blob/master/public/index.gif" />

```sh
npm install seasonme -g
```

```sh
~$ cd ../The.Office.US.S01
~$ seasonme format
```
or

```sh
~$ seasonme format -d MY_FOLDER_PATH
```

```
The.Office.US.S01
│
│   The.Office.US.S01e1.bluray.mkv
│   The.Office.US.S01e2.bluray.mkv
│   The.Office.US.S01e3.bluray.mkv
│   The.Office.US.S01e4.bluray.mkv
│   the office 1x1.srt
│   the office 1x2.srt
│   the office 1x3.srt
│   the office 1x4.srt
```
&#8595;
```
The.Office.US.S01
│
│   The.Office.US.S01E1.BluRay.mkv
│   The.Office.US.S01E1.BluRay.srt
│   The.Office.US.S01E2.BluRay.mkv
│   The.Office.US.S01E2.BluRay.srt
│   The.Office.US.S01E3.BluRay.mkv
│   The.Office.US.S01E3.BluRay.srt
│   The.Office.US.S01E4.BluRay.mkv
│   The.Office.US.S01E4.BluRay.srt
```

<br/>

### For testing you can run as below, which gives you 10 random examples
```sh
~$ mkdir dummy
~$ cd dummy
~$ seasonme generate -n 10
```

## Format Files
```sh
~$ cd ../The.Office.US.S01
~$ seasonme format
```
or
```sh
~$ seasonme format -d MY_FOLDER_PATH
```

## Move Subtitle Files
Organize and move subtitle files from a Subs directory to match with your video files.

### For TV Series
```sh
~$ seasonme movesubs -t series -d MY_SERIES_PATH(e.g. ~/your/path/to/Twin.Peaks)
```

Expects a folder structure like:
```
Twin.Peaks
│
└───Twin.Peaks.S01
│   │   Twin.Peaks.S01E01.mkv
│   │   Twin.Peaks.S01E02.mkv
│   │
│   └───Subs
│       └───Twin.Peaks.S01E01
│           │   English3.srt
│           │   English4.srt
│       └───Twin.Peaks.S01E02
│           │   English3.srt
│           │   English4.srt
```

Resulting folder structure:
```
Twin.Peaks
│
└───Twin.Peaks.S01
│   │   Twin.Peaks.S01E01.mkv
│   │   Twin.Peaks.S01E01.English.3.srt
│   │   Twin.Peaks.S01E01.English.4.srt
│   │   Twin.Peaks.S01E02.mkv
│   │   Twin.Peaks.S01E02.English.3.srt
│   │   Twin.Peaks.S01E02.English.4.srt
```

### For Movies
```sh
~$ seasonme movesubs -t movies -d MY_MOVIES_PATH
```

Expects a folder structure like:
```
movies
│
└───Toy.Story.1995
│   │   Toy.Story.1995.mkv
│   │
│   └───Subs
│       │   English3.srt
│       │   English4.srt
│
└───Mission.Impossible.1996
    │   Mission.Impossible.1996.mkv
    │
    └───Subs
        │   English3.srt
        │   English4.srt
```

The command will:
1. Find all subtitle files in the Subs directory
2. Rename them to match the video file naming pattern
3. Move them to the same directory as the video file
4. Remove the empty Subs directory
