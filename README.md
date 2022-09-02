# seasonme

A tool to organize your TV show files naming and make sure that the subtitle's file matches with the video file in the folder.

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
