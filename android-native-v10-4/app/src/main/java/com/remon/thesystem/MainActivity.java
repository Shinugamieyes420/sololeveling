package com.remon.thesystem;

import android.animation.ValueAnimator;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import java.util.Locale;

public class MainActivity extends Activity {
    private static final int BG=Color.rgb(2,6,13), PANEL=Color.rgb(7,20,34), CYAN=Color.rgb(128,234,255), GOLD=Color.rgb(255,215,123), RED=Color.rgb(255,93,134), GREEN=Color.rgb(72,255,173), MUTED=Color.rgb(144,167,184), WHITE=Color.rgb(242,251,255);
    private final Handler handler=new Handler();
    private SharedPreferences sp;
    private LinearLayout root, content;
    private TextView headerStats;
    private int level,xp,gold,eKeys,hp,mp,activeQuest;
    private long questStart;
    private boolean battle=false, analyzed=false, interrupted=false, broken=false, breakSkip=false;
    private int enemyHp=130, enemyBreak=45, playerHp=168, playerMp=96, ap=2, round=1, guardPct=0;
    private String intent="Quick Slash";
    private ValueAnimator timingAnim;
    private View timingMarker;
    private float timingPos=0f;
    private final String[] qNames={"5 Push-ups","10 Squats","0.5 km Walk","5 Minute Tidy"};
    private final int[] qMinutes={5,8,12,5}, qXp={18,20,25,18}, qGold={10,12,16,10};

    @Override public void onCreate(Bundle b){super.onCreate(b); requestWindowFeature(Window.FEATURE_NO_TITLE); immersive(); sp=getSharedPreferences("the_system_android_v104",MODE_PRIVATE); load(); buildShell(); showStatus(); handler.post(tick);}
    private void immersive(){Window w=getWindow(); if(android.os.Build.VERSION.SDK_INT>=30){w.setDecorFitsSystemWindows(false); WindowInsetsController c=w.getInsetsController(); if(c!=null)c.hide(WindowInsets.Type.statusBars());} }
    private int dp(int x){return (int)(x*getResources().getDisplayMetrics().density+.5f);}    
    private GradientDrawable bg(int color,int stroke){GradientDrawable g=new GradientDrawable();g.setColor(color);g.setCornerRadius(dp(10));g.setStroke(dp(1),stroke);return g;}
    private TextView txt(String s,int size,int color){TextView t=new TextView(this);t.setText(s);t.setTextSize(size);t.setTextColor(color);t.setPadding(dp(10),dp(8),dp(10),dp(8));return t;}
    private Button btn(String s,int color){Button b=new Button(this);b.setText(s);b.setTextColor(WHITE);b.setTextSize(12);b.setAllCaps(false);b.setBackground(bg(color,Color.argb(120,128,234,255)));b.setPadding(dp(8),dp(8),dp(8),dp(8));return b;}
    private void buildShell(){root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setBackgroundColor(BG);root.setPadding(dp(12),dp(18),dp(12),dp(10));setContentView(root);
        LinearLayout top=new LinearLayout(this);top.setOrientation(LinearLayout.VERTICAL);top.setBackground(bg(PANEL,Color.argb(120,128,234,255)));TextView title=txt("THE SYSTEM",27,CYAN);title.setGravity(Gravity.CENTER);title.setLetterSpacing(.12f);top.addView(title);TextView sub=txt("v10.4 • ANDROID HUNTER EDITION",10,MUTED);sub.setGravity(Gravity.CENTER);top.addView(sub);headerStats=txt("",12,WHITE);headerStats.setGravity(Gravity.CENTER);top.addView(headerStats);root.addView(top,new LinearLayout.LayoutParams(-1,-2));
        ScrollView scroll=new ScrollView(this);content=new LinearLayout(this);content.setOrientation(LinearLayout.VERTICAL);content.setPadding(0,dp(10),0,dp(10));scroll.addView(content);root.addView(scroll,new LinearLayout.LayoutParams(-1,0,1));
        LinearLayout nav=new LinearLayout(this);nav.setOrientation(LinearLayout.HORIZONTAL);String[] ns={"STATUS","QUESTS","GATE"};for(String n:ns){Button x=btn(n,PANEL);nav.addView(x,new LinearLayout.LayoutParams(0,dp(52),1));if(n.equals("STATUS"))x.setOnClickListener(v->showStatus());if(n.equals("QUESTS"))x.setOnClickListener(v->showQuests());if(n.equals("GATE"))x.setOnClickListener(v->showGate());}root.addView(nav);refreshHeader();}
    private void clear(){content.removeAllViews();refreshHeader();}
    private void refreshHeader(){if(headerStats!=null)headerStats.setText("LV "+level+"   XP "+xp+"/100   GOLD "+gold+"   E-KEYS "+eKeys);}
    private void card(String title,String body){LinearLayout c=new LinearLayout(this);c.setOrientation(LinearLayout.VERTICAL);c.setBackground(bg(PANEL,Color.argb(90,128,234,255)));c.setPadding(dp(8),dp(8),dp(8),dp(8));TextView a=txt(title,14,CYAN);a.setLetterSpacing(.07f);c.addView(a);c.addView(txt(body,13,WHITE));LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2);p.setMargins(0,0,0,dp(10));content.addView(c,p);}
    private void showStatus(){clear();card("STATUS","Level: "+level+"\nHP: "+hp+"   MP: "+mp+"\nGold: "+gold+"   E-Rank Gate Keys: "+eKeys+"\n\nReal-life quests power your Gate progress. Battles cannot replace quest progression.");if(activeQuest>=0){long remain=Math.max(0,qMinutes[activeQuest]*60-(System.currentTimeMillis()-questStart)/1000);card("ACTIVE QUEST",qNames[activeQuest]+"\nRemaining: "+fmt(remain)+"\nYou can cancel without a penalty.");Button b=btn("CANCEL QUEST",Color.rgb(80,20,35));b.setOnClickListener(v->cancelQuest());content.addView(b,new LinearLayout.LayoutParams(-1,dp(54)));}}
    private void showQuests(){clear();if(activeQuest>=0){LinearLayout a=new LinearLayout(this);a.setOrientation(LinearLayout.VERTICAL);a.setBackground(bg(PANEL,GOLD));a.addView(txt("ACTIVE QUEST",14,GOLD));a.addView(txt(qNames[activeQuest]+"\nTimer keeps running while the app is open or backgrounded.",13,WHITE));LinearLayout row=new LinearLayout(this);Button claim=btn("CLAIM",Color.rgb(18,80,58));claim.setOnClickListener(v->claimQuest());Button cancel=btn("CANCEL QUEST",Color.rgb(85,22,38));cancel.setOnClickListener(v->cancelQuest());row.addView(claim,new LinearLayout.LayoutParams(0,dp(54),1));row.addView(cancel,new LinearLayout.LayoutParams(0,dp(54),1));a.addView(row);content.addView(a,new LinearLayout.LayoutParams(-1,-2));content.addView(txt("",4,WHITE));}
        for(int i=0;i<qNames.length;i++){final int q=i;LinearLayout c=new LinearLayout(this);c.setOrientation(LinearLayout.VERTICAL);c.setBackground(bg(PANEL,Color.argb(80,128,234,255)));c.addView(txt(qNames[i],15,CYAN));c.addView(txt(qMinutes[i]+" min • +"+qXp[i]+" XP • +"+qGold[i]+" Gold • Gate progress",12,MUTED));Button accept=btn(activeQuest==i?"ACTIVE":"ACCEPT QUEST",Color.rgb(16,61,82));accept.setEnabled(activeQuest<0);accept.setOnClickListener(v->acceptQuest(q));c.addView(accept);LinearLayout.LayoutParams p=new LinearLayout.LayoutParams(-1,-2);p.setMargins(0,0,0,dp(9));content.addView(c,p);}}
    private void acceptQuest(int q){if(activeQuest>=0)return;activeQuest=q;questStart=System.currentTimeMillis();save();haptic("GOOD");showQuests();}
    private void cancelQuest(){if(activeQuest<0)return;new AlertDialog.Builder(this).setTitle("Cancel quest?").setMessage(qNames[activeQuest]+"\n\nThe timer stops. The quest stays available and there is no penalty.").setNegativeButton("KEEP",null).setPositiveButton("CANCEL QUEST",(d,w)->{activeQuest=-1;questStart=0;save();haptic("MISS");showQuests();}).show();}
    private void claimQuest(){if(activeQuest<0)return;long elapsed=(System.currentTimeMillis()-questStart)/1000;int q=activeQuest;if(elapsed<qMinutes[q]*60){new AlertDialog.Builder(this).setTitle("Quest still active").setMessage("There is still "+fmt(qMinutes[q]*60-elapsed)+" remaining. Claim anyway only when you really completed it.").setNegativeButton("BACK",null).setPositiveButton("I COMPLETED IT",(d,w)->finishQuest(q)).show();}else finishQuest(q);}
    private void finishQuest(int q){xp+=qXp[q];gold+=qGold[q];eKeys+=1;while(xp>=100){xp-=100;level++;hp+=12;mp+=8;}activeQuest=-1;questStart=0;save();haptic("PERFECT");showStatus();}
    private void showGate(){clear();if(!battle){card("E-RANK GATE","Goblin Scout\nEnemy HP 130 • Break 45 • ATK 22\n\nRecommended: complete real-life quests first. Entering consumes 1 E-Key.");Button enter=btn(eKeys>0?"ENTER E-RANK GATE":"NO E-KEY AVAILABLE",Color.rgb(25,67,88));enter.setEnabled(eKeys>0);enter.setOnClickListener(v->startBattle());content.addView(enter,new LinearLayout.LayoutParams(-1,dp(58)));return;}renderBattle();}
    private void startBattle(){if(eKeys<=0)return;eKeys--;battle=true;enemyHp=130;enemyBreak=45;playerHp=Math.max(1,hp);playerMp=Math.max(1,mp);ap=2;round=1;analyzed=false;interrupted=false;broken=false;breakSkip=false;guardPct=0;intent="Quick Slash";save();showGate();}
    private void renderBattle(){clear();TextView e=txt("GOBLIN SCOUT   E-RANK",19,GOLD);e.setGravity(Gravity.CENTER);content.addView(e);content.addView(bar("ENEMY HP  "+enemyHp+"/130",enemyHp/130f,RED));content.addView(bar("BREAK  "+enemyBreak+"/45",enemyBreak/45f,Color.rgb(197,166,255)));card("ENEMY INTENT",intent+intentInfo());content.addView(bar("PLAYER HP  "+playerHp+"/"+hp,playerHp/(float)Math.max(1,hp),GREEN));content.addView(bar("MP  "+playerMp+"/"+mp,playerMp/(float)Math.max(1,mp),CYAN));TextView turn=txt("ROUND "+round+"   ACTION POINTS "+ap+(broken?"   • BROKEN":"")+(interrupted?"   • INTERRUPTED":""),12,WHITE);turn.setGravity(Gravity.CENTER);content.addView(turn);
        LinearLayout r1=new LinearLayout(this);Button atk=btn("ATTACK\n1 AP",Color.rgb(12,58,75));atk.setOnClickListener(v->startTiming(false));Button guard=btn("GUARD\n1 AP",Color.rgb(78,62,20));guard.setOnClickListener(v->startTiming(true));r1.addView(atk,new LinearLayout.LayoutParams(0,dp(62),1));r1.addView(guard,new LinearLayout.LayoutParams(0,dp(62),1));content.addView(r1);
        LinearLayout r2=new LinearLayout(this);Button ana=btn(analyzed?"ANALYZED":"ANALYZE\n1 AP",Color.rgb(32,42,70));ana.setEnabled(!analyzed);ana.setOnClickListener(v->analyze());Button vit=btn("VITAL STRIKE\n12 MP • 2 AP",Color.rgb(76,31,85));vit.setEnabled(playerMp>=12&&ap>=2);vit.setOnClickListener(v->vital());r2.addView(ana,new LinearLayout.LayoutParams(0,dp(66),1));r2.addView(vit,new LinearLayout.LayoutParams(0,dp(66),1));content.addView(r2);
        Button end=btn("END TURN",Color.rgb(55,24,36));end.setOnClickListener(v->enemyPhase());content.addView(end,new LinearLayout.LayoutParams(-1,dp(52)));}
    private View bar(String label,float pct,int color){LinearLayout box=new LinearLayout(this);box.setOrientation(LinearLayout.VERTICAL);box.addView(txt(label,11,WHITE));FrameLayout track=new FrameLayout(this);track.setBackgroundColor(Color.rgb(18,26,35));View fill=new View(this);fill.setBackgroundColor(color);track.addView(fill,new FrameLayout.LayoutParams(0,dp(10)));box.addView(track,new LinearLayout.LayoutParams(-1,dp(10)));box.post(()->{FrameLayout.LayoutParams lp=(FrameLayout.LayoutParams)fill.getLayoutParams();lp.width=(int)(box.getWidth()*Math.max(0,Math.min(1,pct)));fill.setLayoutParams(lp);});return box;}
    private String intentInfo(){String s="";if(intent.equals("Piercing Lunge"))s="\nHeavy thrust • estimated 26-32 damage • interrupt with 18 Break this round";else if(intent.equals("Dirty Trick"))s="\nCan steal Gold unless Guarded";else if(intent.equals("Double Slash"))s="\nTwo quick hits";else s="\nFast single hit";return analyzed?s:"\nAnalyze to reveal damage and interrupt info.";}
    private void analyze(){if(ap<1||analyzed)return;analyzed=true;ap--;haptic("GOOD");afterAction();}
    private void vital(){if(ap<2||playerMp<12)return;playerMp-=12;ap-=2;int dmg=broken?40:32;enemyHp=Math.max(0,enemyHp-dmg);damageBreak(18);haptic("PERFECT");afterAction();}
    private void startTiming(boolean guard){if(ap<1)return;final FrameLayout overlay=new FrameLayout(this);overlay.setBackgroundColor(Color.argb(245,2,6,13));LinearLayout box=new LinearLayout(this);box.setOrientation(LinearLayout.VERTICAL);box.setGravity(Gravity.CENTER);box.setPadding(dp(18),dp(20),dp(18),dp(20));TextView title=txt(guard?"PERFECT GUARD":"PRECISION ATTACK",22,guard?GOLD:CYAN);title.setGravity(Gravity.CENTER);box.addView(title);box.addView(txt("Red = MISS   •   Blue = GOOD   •   Gold center = PERFECT",12,WHITE));FrameLayout track=new FrameLayout(this);track.setBackgroundColor(RED);View good=new View(this);good.setBackgroundColor(Color.rgb(24,92,119));FrameLayout.LayoutParams glp=new FrameLayout.LayoutParams(-1,dp(52));glp.leftMargin=dp(42);glp.rightMargin=dp(42);track.addView(good,glp);View perfect=new View(this);perfect.setBackgroundColor(GOLD);FrameLayout.LayoutParams plp=new FrameLayout.LayoutParams(dp(70),dp(52),Gravity.CENTER);track.addView(perfect,plp);timingMarker=new View(this);timingMarker.setBackgroundColor(Color.WHITE);FrameLayout.LayoutParams mlp=new FrameLayout.LayoutParams(dp(5),dp(52));track.addView(timingMarker,mlp);box.addView(track,new LinearLayout.LayoutParams(-1,dp(52)));TextView hint=txt("Watch the marker. Tap when it crosses the gold sweetspot.",12,MUTED);hint.setGravity(Gravity.CENTER);box.addView(hint);Button hit=btn(guard?"GUARD NOW":"STRIKE NOW",guard?Color.rgb(98,75,16):Color.rgb(15,74,96));box.addView(hit,new LinearLayout.LayoutParams(-1,dp(62)));overlay.addView(box,new FrameLayout.LayoutParams(-1,-1));root.addView(overlay,new LinearLayout.LayoutParams(-1,-1));
        timingAnim=ValueAnimator.ofFloat(0f,1f);timingAnim.setDuration(1100);timingAnim.setRepeatCount(ValueAnimator.INFINITE);timingAnim.setRepeatMode(ValueAnimator.REVERSE);timingAnim.addUpdateListener(a->{timingPos=(float)a.getAnimatedValue();track.post(()->timingMarker.setTranslationX(timingPos*Math.max(1,track.getWidth()-dp(5))));});timingAnim.start();hit.setOnClickListener(v->{timingAnim.cancel();float d=Math.abs(timingPos-.5f);String q=d<=.08f?"PERFECT":d<=.25f?"GOOD":"MISS";haptic(q);root.removeView(overlay);ap--;if(guard){guardPct=q.equals("PERFECT")?80:q.equals("GOOD")?50:20;if(q.equals("PERFECT"))damageBreak(12);}else{int dmg=q.equals("PERFECT")?22:q.equals("GOOD")?18:13;if(broken)dmg=Math.round(dmg*1.25f);enemyHp=Math.max(0,enemyHp-dmg);damageBreak(q.equals("PERFECT")?10:q.equals("GOOD")?6:3);}afterAction();});}
    private void damageBreak(int amount){if(enemyBreak<=0)return;enemyBreak=Math.max(0,enemyBreak-amount);if(intent.equals("Piercing Lunge")&&amount>=18&&enemyBreak>0)interrupted=true;if(enemyBreak==0){broken=true;breakSkip=true;interrupted=true;}}
    private void afterAction(){if(enemyHp<=0){winBattle();return;}if(ap<=0)enemyPhase();else showGate();}
    private void enemyPhase(){if(!battle)return;if(breakSkip){breakSkip=false;interrupted=false;round++;ap=2;intent=nextIntent();showGate();return;}if(interrupted){interrupted=false;round++;ap=2;intent=nextIntent();showGate();return;}if(broken){broken=false;enemyBreak=45;}
        int dmg;if(intent.equals("Piercing Lunge"))dmg=29;else if(intent.equals("Double Slash"))dmg=20;else if(intent.equals("Dirty Trick"))dmg=8;else dmg=13;dmg=Math.max(0,Math.round(dmg*(100-guardPct)/100f));playerHp=Math.max(0,playerHp-dmg);guardPct=0;if(playerHp<=0){loseBattle();return;}round++;ap=2;intent=nextIntent();showGate();}
    private String nextIntent(){int x=round%4;if(x==1)return "Quick Slash";if(x==2)return "Piercing Lunge";if(x==3)return "Dirty Trick";return "Double Slash";}
    private void winBattle(){battle=false;gold+=18;xp+=8;while(xp>=100){xp-=100;level++;hp+=12;mp+=8;}save();haptic("PERFECT");new AlertDialog.Builder(this).setTitle("GATE CLEARED").setMessage("Goblin Scout defeated.\n\n+8 XP\n+18 Gold").setPositiveButton("CONTINUE",(d,w)->showGate()).show();}
    private void loseBattle(){battle=false;save();haptic("MISS");new AlertDialog.Builder(this).setTitle("DEFEAT").setMessage("You escaped with 1 HP. Complete quests, recover, and return stronger.").setPositiveButton("RETURN",(d,w)->showStatus()).show();}
    private void haptic(String q){try{Vibrator v=(Vibrator)getSystemService(Context.VIBRATOR_SERVICE);if(v==null)return;long ms=q.equals("PERFECT")?45:q.equals("GOOD")?24:12;if(android.os.Build.VERSION.SDK_INT>=26)v.vibrate(VibrationEffect.createOneShot(ms,q.equals("PERFECT")?210:120));else v.vibrate(ms);}catch(Exception ignored){}}
    private String fmt(long s){return String.format(Locale.US,"%02d:%02d",s/60,s%60);}
    private void load(){level=sp.getInt("level",1);xp=sp.getInt("xp",0);gold=sp.getInt("gold",150);eKeys=sp.getInt("keys",2);hp=sp.getInt("hp",168);mp=sp.getInt("mp",96);activeQuest=sp.getInt("aq",-1);questStart=sp.getLong("qs",0);}
    private void save(){sp.edit().putInt("level",level).putInt("xp",xp).putInt("gold",gold).putInt("keys",eKeys).putInt("hp",hp).putInt("mp",mp).putInt("aq",activeQuest).putLong("qs",questStart).apply();refreshHeader();}
    private final Runnable tick=new Runnable(){public void run(){if(activeQuest>=0&&content!=null)refreshHeader();handler.postDelayed(this,1000);}};
    @Override public void onBackPressed(){if(timingAnim!=null&&timingAnim.isRunning()){timingAnim.cancel();}super.onBackPressed();}
}
